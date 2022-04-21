import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import {
  BallotFactory,
  BallotFactory__factory,
  DeepSquare,
  ExposedBallot,
  ExposedBallot__factory,
  ExposedVotingProxy,
  ExposedVotingProxy__factory,
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
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ExposedBallot__factory(owner).deploy(ZERO_ADDRESS, votingProxy.address)).to.be.revertedWith(
        'Vote: DPS address is zero.',
      );
    });
  });

  describe('closeBallot', () => {
    beforeEach(async () => {
      await ballotFactory.addTag('foo');
      await ballotFactory.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      // fetch created ballot
    });

    it('should throw if ballot does not exist', async () => {
      await expect(ballot.closeBallot()).to.revertedWith('Voting: Ballot index is too high.');
    });
    it('should close the ballot', async () => {
      await ballot.closeBallot();
      expect(await ballot.closed()).to.deep.equals(true);
    });
  });

  describe('vote', () => {
    beforeEach(async () => {
      await ballotFactory.addTag('foo');
      await ballotFactory.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      // fetch created ballot
    });

    it('should throw if ballot does not exist', async () => {
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(0))).to.revertedWith(
        'Voting: Ballot index is too high.',
      );
    });
    it('should throw if ballot is closed', async () => {
      await ballot.closeBallot();
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(0))).to.revertedWith('Voting: Ballot is closed.');
    });
    it('should throw if proposal does not exist', async () => {
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(2))).to.revertedWith(
        'Voting: Choice index is too high.',
      );
    });
    it('should throw if voter has granted proxy on the tag', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(0))).to.revertedWith('Voting: Vote is delegated.');
    });
    it('should throw if voter has less than 25k DPS', async () => {
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(0))).to.revertedWith(
        'Voting: Not enough DPS to vote.',
      );
    });
    it('should vote', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await ballot.connect(accounts[0]).vote(BigNumber.from(0));
      expect(await ballot._results()).to.deep.equals([accounts[0].address, [0, true]]); // How can we check private state variable values?
    });
  });

  describe('closeBallot', async () => {
    it('should throw of ballot does not exist', async () => {
      await expect(ballot.closeBallot()).to.revertedWith('Voting: Ballot index is too high.');
    });
    it('should throw if ballot is not closed', async () => {
      await ballotFactory.addTag('foo');
      await ballotFactory.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      // fetch created ballot
      await ballot.closeBallot();
      await expect(ballot.closeBallot()).to.revertedWith('Voting: Ballot already closed.');
    });
    it('should show results', async () => {
      await ballotFactory.addTag('foo');
      await ballotFactory.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      // fetch created ballot
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await agentDPS.transfer(accounts[2], 25000, 18);
      await votingProxy.connect(accounts[2]).grantProxy(accounts[1].address, BigNumber.from(0));
      await ballot.connect(accounts[0]).vote(BigNumber.from(0));
      await ballot.connect(accounts[1]).vote(BigNumber.from(1));
      await ballot.closeBallot();
      expect(await ballot.getResults()).to.deep.equals([parseUnits('25000', 18), parseUnits('50000', 18)]);
    });
  });
});
