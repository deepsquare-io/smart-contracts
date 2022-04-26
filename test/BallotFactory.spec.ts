import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { Ballot } from '../typings/contracts/Ballot';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { BallotFactory } from '../typings/contracts/factories/BallotFactory';
import { BallotFactory__factory } from '../typings/factories/contracts/factories/BallotFactory__factory';
import setup from './testing/setup';
import setupVoting from './testing/setupVoting';

describe('Ballot Factory', async () => {
  let owner: SignerWithAddress;
  let DPS: DeepSquare;
  let ballotImplementation: Ballot;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, DPS } = await setup());
    ({ ballotImplementation, ballotFactory } = await setupVoting(owner, DPS));
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(
        new BallotFactory__factory(owner).deploy(ZERO_ADDRESS, ballotImplementation.address),
      ).to.be.revertedWith('BallotFactory: Implementation address should not be zero address');
    });
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new BallotFactory__factory(owner).deploy(DPS.address, ZERO_ADDRESS)).to.be.revertedWith(
        'BallotFactory: Implementation address should not be zero address',
      );
    });
  });

  describe('createBallot', () => {
    it('should create a new ballot', async () => {
      await ballotFactory.setImplementationAddress(ballotImplementation.address);
      const [ballotAddress] = await ballotFactory
        .createBallot('foo', 'qux', ['bar', 'baz'])
        .then(async (t) => (await t.wait()).events?.find((e) => e.event === 'BallotCreated')?.args ?? []);
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
