import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import {
  Ballot,
  Ballot__factory,
  BallotFactory,
  BallotFactory__factory,
  DeepSquare,
  ExposedVotingProxy,
  ExposedVotingProxy__factory,
} from '../typings';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe('Voting proxy', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;
  let votingProxy: ExposedVotingProxy;
  let ballotMaster: Ballot;
  let ballotFactory: BallotFactory;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
    votingProxy = await new ExposedVotingProxy__factory(owner).deploy(DPS.address);
    ballotMaster = await new Ballot__factory(owner).deploy(DPS.address, votingProxy.address);
    ballotFactory = await new BallotFactory__factory(owner).deploy(ballotMaster.address, votingProxy.address);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ExposedVotingProxy__factory(owner).deploy(ZERO_ADDRESS)).to.be.revertedWith(
        'VotingProxy: DPS address is zero.',
      );
    });
  });

  describe('setBallotFactory', () => {
    it('should set the ballot factory address', async () => {
      await votingProxy.setBallotFactory(ballotFactory.address);
      expect(await votingProxy.ballotFactory()).to.equals(ballotFactory.address);
    });
  });

  describe('grantProxy', () => {
    beforeEach(async () => {
      await votingProxy.setBallotFactory(ballotFactory.address);
    });

    it('should throw if tag does not exist', async () => {
      await expect(votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Tag index is too high',
      );
    });
    it('should throw if delegate has less than 25k DPS', async () => {
      await ballotFactory.addTag('foo');
      await expect(votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Proxy has not enough DPS.',
      );
    });
    it('should register delegation', async () => {
      await ballotFactory.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([accounts[0].address]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[1].address);
    });
    it('should change delegation', async () => {
      await ballotFactory.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await agentDPS.transfer(accounts[2], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[2].address, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await votingProxy._delegates(accounts[2].address, BigNumber.from(0))).to.deep.equals([accounts[0].address]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[2].address);
    });
    it('should remove delegation', async () => {
      await ballotFactory.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await votingProxy.connect(accounts[0]).grantProxy(ZERO_ADDRESS, BigNumber.from(0));
      expect(await votingProxy._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await votingProxy._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(ZERO_ADDRESS);
    });
  });

  describe('proxyAmount', () => {
    beforeEach(async () => {
      await votingProxy.setBallotFactory(ballotFactory.address);
    });
    it('should throw if tag does not exist', async () => {
      await expect(votingProxy.proxyAmount(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'VotingProxy: Tag index is too high',
      );
    });
    it('should returns total proxy vote power', async () => {
      await ballotFactory.addTag('foo');
      await agentDPS.transfer(accounts[0], 55555, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy.proxyAmount(accounts[1].address, BigNumber.from(0))).to.equals(parseUnits('55555', 18));
    });
  });

  describe('hasDelegated', () => {
    beforeEach(async () => {
      await votingProxy.setBallotFactory(ballotFactory.address);
    });
    it('should returns if a voter has delegated his vote on specified tag', async () => {
      await ballotFactory.addTag('foo');
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await votingProxy.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await votingProxy.hasDelegated(accounts[0].address, BigNumber.from(0))).to.equals(true);
      expect(await votingProxy.hasDelegated(accounts[1].address, BigNumber.from(0))).to.equals(false);
    });
  });
});
