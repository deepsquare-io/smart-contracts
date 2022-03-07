import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MissingRoleError } from './utils/AccessControl';
import { createERC20Agent, ERC20Agent } from './utils/ERC20';
import { DPS_TOTAL_SUPPLY } from './utils/constants';
import { randomInt } from './utils/random';

describe('DeepSquare', () => {
  let deployer: SignerWithAddress;
  let spender: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let agentDPS: ERC20Agent;

  beforeEach(async () => {
    [deployer, spender, ...accounts] = await ethers.getSigners();

    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy();
    agentDPS = createERC20Agent(DPS);

    await DPS.grantRole(ethers.utils.id('SPENDER'), deployer.address);
  });

  it('should mint 210M DPS to the deployer', async () => {
    await agentDPS.expectBalanceOf(deployer, DPS_TOTAL_SUPPLY);
  });

  it('should prevent non-spender accounts to move DPS', async () => {
    await DPS.transfer(spender.address, ethers.utils.parseUnits('2000', 18));

    // Attempt to move DPS as the spender before being granted the role
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
    it('should allow the deployer to move DPS tokens freely', async () => {
      await agentDPS.transfer(accounts[0].address, 42);
      await agentDPS.expectBalanceOf(accounts[0], 42);

      await DPS.transferFrom(accounts[0].address, accounts[1].address, agentDPS.parseUnit(12));
      await agentDPS.expectBalanceOf(accounts[1], 12);
      await agentDPS.expectBalanceOf(accounts[0], 30);
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
