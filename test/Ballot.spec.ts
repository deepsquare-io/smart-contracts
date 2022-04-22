import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { BallotTagManager, DeepSquare, ExposedBallot, ExposedBallot__factory, ExposedVotingProxy } from '../typings';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';
import setupVoting from './testing/setupVoting';

describe('Ballot', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let ballot: ExposedBallot;
  let agentDPS: ERC20Agent;
  let ballotTagManager: BallotTagManager;
  let votingProxy: ExposedVotingProxy;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    ({ ballotTagManager, votingProxy } = await setupVoting(owner, DPS));

    ballot = await new ExposedBallot__factory(owner).deploy(DPS.address, votingProxy.address);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ExposedBallot__factory(owner).deploy(ZERO_ADDRESS, votingProxy.address)).to.be.revertedWith(
        'Vote: DPS address is zero.',
      );
    });
  });

  describe('init', () => {
    it('should initialize ballot state variables', async () => {
      await ballot.init('foo', BigNumber.from(0), ['bar', 'baz']);
      expect(await ballot.subject()).to.equals('foo');
      expect(await ballot.tagIndex()).to.equals(BigNumber.from(0));
      expect(await ballot.getChoices()).to.deep.equals(['bar', 'baz']);
      expect(await ballot.getResults()).to.deep.equals([BigNumber.from(0), BigNumber.from(0)]);
    });
  });

  describe('vote', () => {
    beforeEach(async () => {
      await ballotTagManager.addTag('foo');
      await ballot.init('foo', BigNumber.from(0), ['bar', 'baz']);
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
      expect(await ballot._results()).to.deep.equals([[accounts[0].address, [0, true]]]);
      await ballot.connect(accounts[0]).vote(BigNumber.from(1));
      expect(await ballot._results()).to.deep.equals([[accounts[0].address, [1, true]]]);
    });
  });

  describe('closeBallot', async () => {
    beforeEach(async () => {
      await ballotTagManager.addTag('foo');
      await ballot.init('foo', BigNumber.from(0), ['bar', 'baz']);
    });
    it('should throw if ballot is not closed', async () => {
      await ballot.closeBallot();
      await expect(ballot.closeBallot()).to.revertedWith('Voting: Ballot already closed.');
    });
    it('should show results', async () => {
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
