import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import {
  Ballot,
  Ballot__factory,
  BallotFactory,
  BallotFactory__factory,
  DeepSquare,
  VotingProxy,
  VotingProxy__factory,
} from '../typings';
import setup from './testing/setup';

describe.only('Ballot Factory', async () => {
  let owner: SignerWithAddress;
  let DPS: DeepSquare;
  let votingProxy: VotingProxy;
  let ballotImplementation: Ballot;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, DPS } = await setup());
    votingProxy = await new VotingProxy__factory(owner).deploy(DPS.address);
    ballotImplementation = await new Ballot__factory(owner).deploy(DPS.address, votingProxy.address);
    ballotFactory = await new BallotFactory__factory(owner).deploy(ballotImplementation.address, votingProxy.address);
    await votingProxy.setBallotFactory(ballotFactory.address);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new BallotFactory__factory(owner).deploy(ZERO_ADDRESS, votingProxy.address)).to.be.revertedWith(
        'BallotFactory: Implementation address should not be zero address',
      );
    });
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(
        new BallotFactory__factory(owner).deploy(ballotImplementation.address, ZERO_ADDRESS),
      ).to.be.revertedWith('BallotFactory: Voting proxy address should not be zero address');
    });
  });

  describe('createBallot', () => {
    it('should throw if tag does not exist', async () => {
      await expect(ballotFactory.createBallot('foo', 0, ['bar', 'baz'])).to.revertedWith(
        'BallotFactory: Tag index is too high.',
      );
    });

    it('should create a new ballot', async () => {
      await ballotFactory.addTag('foo');
      await ballotFactory.setImplementationAddress(ballotImplementation.address);
      const ballotAddress = await ballotFactory.createBallot('foo', 0, ['bar', 'baz']).then((t) => t.data);
      expect(await ballotFactory.getBallots()).to.deep.equals([ballotAddress]);
    });
  });

  describe('setImplementationAddress', () => {
    it('should throw if implementation address is zero address', async () => {
      await expect(ballotFactory.setImplementationAddress(ZERO_ADDRESS)).to.revertedWith(
        'BallotFactory: Implementation address should not be zero address',
      );
    });
    it('should set the implementation address', async () => {
      await ballotFactory.setImplementationAddress(ballotImplementation.address);
      expect(await ballotFactory.implementationAddress()).to.equals(ballotImplementation.address);
    });
  });
});
