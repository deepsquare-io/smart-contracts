import { expect } from 'chai';
import { id } from '@ethersproject/hash';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { BallotFactory } from '../typings/contracts/voting/BallotFactory';
import { VotingDelegation } from '../typings/contracts/voting/VotingDelegation';
import { ExposedBallot } from '../typings/contracts/voting/testing/ExposedBallot';
import { ExposedBallot__factory } from '../typings/factories/contracts/voting/testing/ExposedBallot__factory';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';
import setupVoting from './testing/setupVoting';

describe('Ballot', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let ballot: ExposedBallot;
  let agentDPS: ERC20Agent;
  let votingDelegation: VotingDelegation;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    ({ votingDelegation, ballotFactory } = await setupVoting(owner, DPS));

    ballot = await new ExposedBallot__factory(owner).deploy(DPS.address, votingDelegation.address);
  });

  describe('init', () => {
    it('should initialize ballot state variables', async () => {
      await ballot.init(DPS.address, votingDelegation.address, ballotFactory.address, 'foo', 'bar', 'bar', [
        'baz',
        'qux',
      ]);
      expect(await ballot.title()).to.equals(id('foo'));
      expect(await ballot.description()).to.equals(id('bar'));
      expect(await ballot.topic()).to.equals(id('bar'));
      expect(await ballot.getChoices()).to.deep.equals([id('baz'), id('qux')]);
    });
  });

  describe('isValidChoice', () => {
    it('should return if given choice is a valid vote choice', async () => {
      await ballot.init(DPS.address, votingDelegation.address, ballotFactory.address, 'foo', 'bar', 'bar', [
        'baz',
        'qux',
      ]);
      expect(await ballot.isValidChoice(id('baz'))).to.equals(true);
      expect(await ballot.isValidChoice(id('baq'))).to.equals(false);
    });
  });

  describe('vote', () => {
    beforeEach(async () => {
      await ballot.init(DPS.address, votingDelegation.address, ballotFactory.address, 'foo', 'bar', 'qux', [
        'bar',
        'baz',
      ]);
    });
    it('should throw if ballot is closed', async () => {
      await ballot.close();
      await expect(ballot.connect(accounts[0]).vote('bar')).to.revertedWith('Voting: Ballot is closed.');
    });
    it('should throw if voter has granted proxy on the topic', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'qux');
      await expect(ballot.connect(accounts[0]).vote('bar')).to.revertedWith('Voting: Vote is delegated.');
    });
    it('should throw if voter has less than 25k DPS', async () => {
      await expect(ballot.connect(accounts[0]).vote('bar')).to.revertedWith('Voting: Not enough DPS to vote.');
    });
    it('should throw if proposal does not exist', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await expect(ballot.connect(accounts[0]).vote('baq')).to.revertedWith('Voting: Choice is invalid.');
    });
    it('should vote', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await ballot.connect(accounts[0]).vote('bar');
      expect(await ballot._results()).to.deep.equals([[accounts[0].address, [id('bar'), true]]]);
      await ballot.connect(accounts[0]).vote('baz');
      expect(await ballot._results()).to.deep.equals([[accounts[0].address, [id('baz'), true]]]);
    });
  });

  describe('closeBallot', async () => {
    beforeEach(async () => {
      await ballot.init(DPS.address, votingDelegation.address, ballotFactory.address, 'foo', 'bar', 'qux', [
        'bar',
        'baz',
      ]);
    });
    it('should throw if is not the factory owner', async () => {
      await expect(ballot.connect(accounts[0]).close()).to.revertedWith('Voting: Restricted to factory owner.');
    });
    it('should throw if ballot is not closed', async () => {
      await ballot.close();
      await expect(ballot.close()).to.revertedWith('Voting: Ballot already closed.');
    });
    it('should show results', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await agentDPS.transfer(accounts[2], 25000, 18);
      await votingDelegation.connect(accounts[2]).delegate(accounts[1].address, 'qux');
      await ballot.connect(accounts[0]).vote('bar');
      await ballot.connect(accounts[1]).vote('baz');
      await ballot.close();
      // expect(await ballot.getResults()).to.deep.equals([parseUnits('25000', 18), parseUnits('50000', 18)]);
    });
  });
});
