import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DPS_TOTAL_SUPPLY } from '../lib/constants';
import waitTx from '../lib/waitTx';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { ERC20Agent } from './testing/ERC20Agent';
import { randomInt } from './testing/random';
import setup from './testing/setup';

describe('DeepSquare', async () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;

  beforeEach(async () => {
    ({ owner, accounts, DPS, agentDPS } = await setup());
  });

  describe('on initialization', () => {
    it('should mint 210M DPS to the deployer', async () => {
      await agentDPS.expectBalanceOf(owner, DPS_TOTAL_SUPPLY);
    });

    it('should promote the deployer to be the contract owner', async () => {
      expect(await DPS.owner()).to.equals(owner.address);
    });
  });

  describe('transfer', () => {
    describe('if the sender is the contract owner', () => {
      it('should let him transfer its own DPS to another account', async () => {
        const initialBalance = await DPS.balanceOf(owner.address);
        const amount = agentDPS.unit(randomInt(10, 50) * 1000);
        await agentDPS.transfer(accounts[0], amount);
        await agentDPS.expectBalanceOf(accounts[0], amount);
        await agentDPS.expectBalanceOf(owner, initialBalance.sub(amount));
      });
    });
  });

  describe('transferFrom', () => {
    describe('the account is the owner', () => {
      it('should let the owner transfer DPS from other accounts with their consent', async () => {
        const amount = agentDPS.unit(randomInt(10, 50) * 1000);
        await agentDPS.transfer(accounts[0], amount);

        await DPS.connect(accounts[0]).approve(owner.address, amount);
        expect(await DPS.allowance(accounts[0].address, owner.address)).to.equals(amount);

        await DPS.transferFrom(accounts[0].address, accounts[1].address, amount);
        expect(await DPS.allowance(accounts[0].address, owner.address)).to.equals(0);
        await agentDPS.expectBalanceOf(accounts[0], 0);
        await agentDPS.expectBalanceOf(accounts[1], amount);
      });

      it('should prevent the owner from transferring DPS from other accounts with their consent', async () => {
        const amount = agentDPS.unit(randomInt(10, 50) * 1000);
        await agentDPS.transfer(accounts[0], amount);
        await expect(DPS.transferFrom(accounts[0].address, accounts[1].address, amount)).to.revertedWith(
          'ERC20: insufficient allowance',
        );
      });
    });
  });

  describe('setSecurity', () => {
    it('should revert if caller is not the owner', async () => {
      const initialSecurity = await DPS.security();
      await expect(DPS.connect(accounts[0]).setSecurity(accounts[1].address)).to.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(await DPS.security()).to.equals(initialSecurity);
    });

    it('should add a new security (to change transfer rules)', async () => {
      await DPS.setSecurity(accounts[1].address);
      expect(await DPS.security()).to.equals(accounts[1].address);
    });
  });
});
