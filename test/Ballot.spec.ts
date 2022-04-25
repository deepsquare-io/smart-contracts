import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare, ExposedBallot, ExposedBallot__factory, VotingDelegation } from '../typings';
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

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    ({ votingDelegation } = await setupVoting(owner, DPS));

    ballot = await new ExposedBallot__factory(owner).deploy(DPS.address, votingDelegation.address);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ExposedBallot__factory(owner).deploy(ZERO_ADDRESS, votingDelegation.address)).to.be.revertedWith(
        'Vote: DPS address is zero.',
      );
    });
  });

  describe('init', () => {
    it('should initialize ballot state variables', async () => {
      await ballot.init('foo', 'bar', ['baz', 'qux']);
      expect(await ballot.subject()).to.equals('foo');
      expect(await ballot.topic()).to.equals('bar');
      expect(await ballot.getChoices()).to.deep.equals(['baz', 'qux']);
      expect(await ballot.getResults()).to.deep.equals([BigNumber.from(0), BigNumber.from(0)]);
    });
  });

  describe('vote', () => {
    beforeEach(async () => {
      await ballot.init('foo', 'qux', ['bar', 'baz']);
    });
    it('should throw if ballot is closed', async () => {
      await ballot.close();
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(0))).to.revertedWith('Voting: Ballot is closed.');
    });
    it('should throw if proposal does not exist', async () => {
      await expect(ballot.connect(accounts[0]).vote(BigNumber.from(2))).to.revertedWith(
        'Voting: Choice index is too high.',
      );
    });
    it('should throw if voter has granted proxy on the topic', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'qux');
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
      await ballot.init('foo', 'qux', ['bar', 'baz']);
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
      await ballot.connect(accounts[0]).vote(BigNumber.from(0));
      await ballot.connect(accounts[1]).vote(BigNumber.from(1));
      await ballot.close();
      expect(await ballot.getResults()).to.deep.equals([parseUnits('25000', 18), parseUnits('50000', 18)]);
    });
  });
});
