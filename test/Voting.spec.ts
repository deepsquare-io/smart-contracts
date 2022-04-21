import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare, ExposedVoting, ExposedVoting__factory } from '../typings';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe.only('Voting', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let Voting: ExposedVoting;
  let agentDPS: ERC20Agent;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());

    Voting = await new ExposedVoting__factory(owner).deploy(DPS.address);
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
      await Voting.addTag('foo');
      await Voting.addTag('bar');
      expect(await Voting.getTags()).to.deep.equals(['foo', 'bar']);
    });
  });

  describe('createBallot', () => {
    it('should throw if tag does not exist', async () => {
      await expect(Voting.createBallot('foo', BigNumber.from(1), ['bar', 'baz'])).to.revertedWith(
        'Voting: Tag index is too high.',
      );
    });
    it('should create a ballot', async () => {
      await Voting.addTag('foo');
      await Voting.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      expect(await Voting.getBallots()).to.deep.equals([['bar', false, 0]]);
      expect(await Voting.getChoices()).to.deep.equals([['baz', 'qux']]);
    });
  });

  describe('closeBallot', () => {
    beforeEach(async () => {
      await Voting.addTag('foo');
      await Voting.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
    });

    it('should throw if ballot does not exist', async () => {
      await expect(Voting.closeBallot(BigNumber.from(1))).to.revertedWith('Voting: Ballot index is too high.');
    });
    it('should close the ballot', async () => {
      await Voting.closeBallot(BigNumber.from(0));
      expect(await Voting.getBallots()).to.deep.equals([['bar', true, 0]]);
    });
  });

  describe('vote', () => {
    beforeEach(async () => {
      await Voting.addTag('foo');
      await Voting.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
    });

    it('should throw if ballot does not exist', async () => {
      await expect(Voting.connect(accounts[0]).vote(BigNumber.from(1), BigNumber.from(0))).to.revertedWith(
        'Voting: Ballot index is too high.',
      );
    });
    it('should throw if ballot is closed', async () => {
      await Voting.closeBallot(BigNumber.from(0));
      await expect(Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(0))).to.revertedWith(
        'Voting: Ballot is closed.',
      );
    });
    it('should throw if proposal does not exist', async () => {
      await expect(Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(2))).to.revertedWith(
        'Voting: Choice index is too high.',
      );
    });
    it('should throw if voter has granted proxy on the tag', async () => {
      await agentDPS.transfer(accounts[1], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await expect(Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(0))).to.revertedWith(
        'Voting: Vote is delegated.',
      );
    });
    it('should throw if voter has less than 25k DPS', async () => {
      await expect(Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(0))).to.revertedWith(
        'Voting: Not enough DPS to vote.',
      );
    });
    it('should vote', async () => {
      await agentDPS.transfer(accounts[0], 25000, 18);
      await Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(0));
      expect(await Voting._results(BigNumber.from(0))).to.deep.equals([[accounts[0].address, [0, true]]]); // How can we check private state variable values?
    });
  });

  describe('grantProxy', () => {
    it('should throw if tag does not exist', async () => {
      await expect(Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'Voting: Tag index is too high',
      );
    });
    it('should throw if delegate has less than 25k DPS', async () => {
      await Voting.addTag('foo');
      await expect(Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'Voting: Proxy has not enough DPS.',
      );
    });
    it('should register delegation', async () => {
      await Voting.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await Voting._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([accounts[0].address]);
      expect(await Voting._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[1].address);
    });
    it('should change delegation', async () => {
      await Voting.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await agentDPS.transfer(accounts[2], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[2].address, BigNumber.from(0));
      expect(await Voting._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await Voting._delegates(accounts[2].address, BigNumber.from(0))).to.deep.equals([accounts[0].address]);
      expect(await Voting._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(accounts[2].address);
    });
    it('should remove delegation', async () => {
      await Voting.addTag('foo');
      await agentDPS.transfer(accounts[1], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      await Voting.connect(accounts[0]).grantProxy(ZERO_ADDRESS, BigNumber.from(0));
      expect(await Voting._delegates(accounts[1].address, BigNumber.from(0))).to.deep.equals([]);
      expect(await Voting._proxyVoters(accounts[0].address, BigNumber.from(0))).to.equals(ZERO_ADDRESS);
    });
  });

  describe('totalProxyAmount', () => {
    it('should throw if tag does not exist', async () => {
      await expect(Voting.totalProxyAmount(accounts[1].address, BigNumber.from(0))).to.revertedWith(
        'Voting: Tag index is too high',
      );
    });
    it('should returns total proxy vote power', async () => {
      await Voting.addTag('foo');
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await Voting.connect(accounts[0]).grantProxy(accounts[1].address, BigNumber.from(0));
      expect(await Voting.totalProxyAmount(accounts[1].address, BigNumber.from(0))).to.equals(parseUnits('50000', 18));
    });
  });

  describe('closeBallot', async () => {
    it('should throw of ballot does not exist', async () => {
      await expect(Voting.closeBallot(BigNumber.from(0))).to.revertedWith('Voting: Ballot index is too high.');
    });
    it('should throw if ballot is not closed', async () => {
      await Voting.addTag('foo');
      await Voting.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      await Voting.closeBallot(BigNumber.from(0));
      await expect(Voting.closeBallot(BigNumber.from(0))).to.revertedWith('Voting: Ballot already closed.');
    });
    it('should show results', async () => {
      await Voting.addTag('foo');
      await Voting.createBallot('bar', BigNumber.from(0), ['baz', 'qux']);
      await agentDPS.transfer(accounts[0], 25000, 18);
      await agentDPS.transfer(accounts[1], 25000, 18);
      await agentDPS.transfer(accounts[2], 25000, 18);
      await Voting.connect(accounts[2]).grantProxy(accounts[1].address, BigNumber.from(0));
      await Voting.connect(accounts[0]).vote(BigNumber.from(0), BigNumber.from(0));
      await Voting.connect(accounts[1]).vote(BigNumber.from(0), BigNumber.from(1));
      await Voting.closeBallot(BigNumber.from(0));
      expect(await Voting.getBallotResult(BigNumber.from(0))).to.deep.equals([
        parseUnits('25000', 18),
        parseUnits('50000', 18),
      ]);
    });
  });
});
