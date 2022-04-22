import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import {
  BallotFactory,
  BallotTagManager,
  DeepSquare,
  ExposedVotingProxy,
  ExposedVotingProxy__factory,
} from '../typings';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';
import setupVoting from './testing/setupVoting';

describe('Voting proxy', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;
  let ballotTagManager: BallotTagManager;
  let votingProxy: ExposedVotingProxy;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    ({ ballotTagManager, votingProxy, ballotFactory } = await setupVoting(owner, DPS));
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(
        new ExposedVotingProxy__factory(owner).deploy(ZERO_ADDRESS, ballotTagManager.address),
      ).to.be.revertedWith('VotingProxy: DPS address is zero.');
    });
    it('should revert if the Ballot tag manager is the zero address', async () => {
      await expect(new ExposedVotingProxy__factory(owner).deploy(DPS.address, ZERO_ADDRESS)).to.be.revertedWith(
        'VotingProxy: Ballot tag manager address is zero.',
      );
    });
  });

  describe('grantProxy', () => {
    it('should throw if tag does not exist', async () => {
      await expect(votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Tag index is too high',
      );
    });
    it('should throw if delegate has less than 25k DPS', async () => {
      await ballotTagManager.addTag('foo');
      await expect(votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Proxy has not enough DPS.',
      );
    });
    it('should register delegation', async () => {
      await ballotTagManager.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([
        accounts[0].address,
      ]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[1].address);
    });
    it('should change delegation', async () => {
      await ballotTagManager.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await agentDPS.transfer(accounts[2], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[2].address, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await votingProxy._delegates(accounts[2].address, BigNumber.from(0))).to.deep.equals([
        accounts[0].address,
      ]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[2].address);
    });
    it('should remove delegation', async () => {
      await ballotTagManager.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await votingProxy.connect(accounts[0]).grantProxy(ZERO_ADDRESS, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(ZERO_ADDRESS);
    });
  });

  describe('proxyAmount', () => {
    it('should throw if tag does not exist', async () => {
      await expect(votingProxy.proxyAmount(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Tag index is too high',
      );
    });
    it('should returns total proxy vote power', async () => {
      await ballotTagManager.addTag('foo');
      await agentDPS.transfer(accounts[0], 55555, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy.proxyAmount(accounts[1].address, BigNumber.from(0))).to.equals(parseUnits('55555', 18));
    });
  });

  describe('hasDelegated', () => {
    it('should returns if a voter has delegated his vote on specified tag', async () => {
      await ballotTagManager.addTag('foo');
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy.hasDelegated(accounts[0].address, BigNumber.from(0))).to.equals(true);
      expect(await votingProxy.hasDelegated(accounts[1].address, BigNumber.from(0))).to.equals(false);
    });
  });
});
