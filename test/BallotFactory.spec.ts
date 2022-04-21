import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import {
  Ballot, Ballot__factory,
  BallotFactory, BallotFactory__factory,
  DeepSquare,
  ExposedBallot, ExposedBallot__factory,
  ExposedVoting,
  ExposedVoting__factory,
  ExposedVotingProxy, ExposedVotingProxy__factory
} from '../typings';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe.only('Ballot', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let ballot: ExposedBallot;
  let agentDPS: ERC20Agent;
  let votingProxy: ExposedVotingProxy;
  let ballotMaster: ExposedBallot;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    votingProxy = await new ExposedVotingProxy__factory(owner).deploy(DPS.address);
    ballotMaster = await new ExposedBallot__factory(owner).deploy(DPS.address, votingProxy.address);
    ballotFactory = await new BallotFactory__factory(owner).deploy(ballotMaster.address);
    await votingProxy.setBallotFactory(ballotFactory.address);
    ballot = await ballotFactory.createBallot();
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ExposedVoting__factory(owner).deploy(ZERO_ADDRESS)).to.be.revertedWith(
        'Vote: DPS address is zero.',
      );
    });
  });

  describe('addTag', () => {
    it('should add a tag to the list', async () => {
      await ballot.addTag('foo');
      await ballot.addTag('bar');
      expect(await ballot.getTags()).to.deep.equals(['foo', 'bar']);
    });
  });

  describe('createBallot', () => {
    it('should throw if tag does not exist', async () => {
      await expect(ballot.createBallot('foo', BigNumber.from(1), ['bar', 'baz'])).to.revertedWith(
        'Voting: Tag index is too high.',
      );
    });
    it('should create a ballot', async () => {
      await ballot.addTag('foo');
      await ballot.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      expect(await ballot.getBallots()).to.deep.equals([['bar', false, 0]]);
      expect(await ballot.getChoices()).to.deep.equals([['baz', 'qux']]);
    });
  });
});
