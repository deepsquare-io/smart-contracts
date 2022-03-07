import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DEFAULT_ADMIN_ROLE, MissingRoleError } from './utils/AccessControl';
import { createERC20Agent, ERC20Agent } from './utils/ERC20';
import { DPS_TOTAL_SUPPLY } from './utils/constants';
import { randomInt } from './utils/random';

describe('DeepSquare', async () => {
  let deployer: SignerWithAddress;
  let sale: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let agentDPS: ERC20Agent;

  const SPENDER_ROLE = ethers.utils.id('SPENDER');

  beforeEach(async () => {
    [deployer, sale, ...accounts] = await ethers.getSigners();

    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy();
    agentDPS = createERC20Agent(DPS);

    await DPS.grantRole(SPENDER_ROLE, deployer.address);
  });

  describe('constructor', () => {
    it('should mint 210M DPS to the deployer', async () => {
      await agentDPS.expectBalanceOf(deployer, DPS_TOTAL_SUPPLY);
    });

    it('should grant the ADMIN role to the deployer', async () => {
      expect(await DPS.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.true;
    });
  });

  describe('transfer', () => {
    it('should let deployer transfer DPS to another account', async () => {
      const amount = await agentDPS.parseUnit(randomInt(10, 50) * 1000);
      await agentDPS.transfer(accounts[0], amount);
      await agentDPS.expectBalanceOf(accounts[0], amount);
    });

    it('should revert if the account is not the deployer nor a spender', async () => {
      const initialBalance = await DPS.balanceOf(deployer.address);
      const amount = await agentDPS.parseUnit(randomInt(10, 50) * 1000);

      await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, amount)).to.be.revertedWith(
        MissingRoleError(accounts[0], 'SPENDER'),
      );
      await agentDPS.expectBalanceOf(deployer.address, initialBalance, 'wei');
    });
  });

  describe('transferFrom', () => {
    it('should revert if the deployer has not the account allowance', async () => {
      await agentDPS.transfer(accounts[0].address, 42);
      await agentDPS.expectBalanceOf(accounts[0], 42);

      await expect(DPS.transferFrom(accounts[0].address, accounts[1].address, agentDPS.parseUnit(12))).to.revertedWith(
        'ERC20: insufficient allowance',
      );
    });

    it('should revert if the account is not the deployer', async () => {
      await agentDPS.transfer(accounts[0].address, 42);
      await agentDPS.expectBalanceOf(accounts[0], 42);

      await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, agentDPS.parseUnit(12))).to.be.revertedWith(
        MissingRoleError(accounts[0], 'SPENDER'),
      );
    });
  });
});
