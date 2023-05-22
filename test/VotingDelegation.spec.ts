import { expect } from 'chai';
import { id } from '@ethersproject/hash';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { VotingDelegation } from '../typings/contracts/voting/VotingDelegation';
import { VotingDelegation__factory } from '../typings/factories/contracts/voting/VotingDelegation__factory';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';
import setupVoting from './testing/setupVoting';

describe('Voting delegation', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;
  let votingDelegation: VotingDelegation;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    ({ votingDelegation } = await setupVoting(owner, DPS));
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new VotingDelegation__factory(owner).deploy(ZERO_ADDRESS)).to.be.revertedWith(
        'VotingDelegation: DPS address is zero.',
      );
    });
  });

  describe('delegate', () => {
    it('should throw if delegate has less than 25k DPS', async () => {
      await expect(votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo')).to.revertedWith(
        'VotingDelegation: Proxy has not enough DPS.',
      );
    });
    it('should register delegation', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo');
      expect(await votingDelegation.delegators(accounts[1].address, 'foo')).to.deep.equals([accounts[0].address]);
      expect(await votingDelegation.representative(accounts[0].address, 'foo')).to.equals(accounts[1].address);
    });
    it('should change delegation', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo');
      await agentDPS.transfer(accounts[2], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[2].address, 'foo');
      expect(await votingDelegation.delegators(accounts[1].address, 'foo')).to.deep.equals([]);
      expect(await votingDelegation.delegators(accounts[2].address, 'foo')).to.deep.equals([accounts[0].address]);
      expect(await votingDelegation.representative(accounts[0].address, 'foo')).to.equals(accounts[2].address);
    });
    it('should remove delegation', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo');
      await votingDelegation.connect(accounts[0]).delegate(ZERO_ADDRESS, 'foo');
      expect(await votingDelegation.delegators(accounts[1].address, 'foo')).to.deep.equals([]);
      expect(await votingDelegation.representative(accounts[0].address, 'foo')).to.equals(ZERO_ADDRESS);
    });
  });

  describe('delegationAmount', () => {
    it('should returns total delegation vote power', async () => {
      await agentDPS.transfer(accounts[0], 55555, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo');
      expect(await votingDelegation.delegationAmount(accounts[1].address, id('foo'))).to.equals(
        parseUnits('55555', 18),
      );
    });
  });

  describe('hasDelegated', () => {
    it('should returns if a voter has delegated his vote on specified tag', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingDelegation.connect(accounts[0]).delegate(accounts[1].address, 'foo');
      expect(await votingDelegation.hasDelegated(accounts[0].address, id('foo'))).to.equals(true);
      expect(await votingDelegation.hasDelegated(accounts[1].address, id('foo'))).to.equals(false);
    });
  });
});
