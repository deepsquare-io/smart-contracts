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


    const SecurityFactory = await ethers.getContractFactory('SpenderSecurity');
    const security = await SecurityFactory.deploy();
    
    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy(security.address);
    agentDPS = createERC20Agent(DPS);

  });

  describe('on initialization', () => {
    it('should mint 210M DPS to the deployer', async () => {
      await agentDPS.expectBalanceOf(deployer, DPS_TOTAL_SUPPLY);
    });

  });

  describe('transfer', () => {
    describe('if sender is the contract owner', () => {
    it('should let transfer its own DPS to another account', async () => {
      const amount = await agentDPS.parseUnit(randomInt(10, 50) * 1000);
      await agentDPS.transfer(accounts[0], amount);
      await agentDPS.expectBalanceOf(accounts[0], amount);
    });
    it('should not be able to transfer other people money without their consent (ERC20)', async() => {});
  });
  describe('if sender is not the contract owner', () => {
    it('should revert if sender is not in the SPENDER allowList', async () => {
      // TODO test changed
      const initialBalance = await DPS.balanceOf(deployer.address);
      const amount = await agentDPS.parseUnit(randomInt(10, 50) * 1000);

      await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, amount)).to.be.revertedWith(
        MissingRoleError(accounts[0], 'SPENDER'),
      );
      await agentDPS.expectBalanceOf(deployer.address, initialBalance, 'wei');
    });
    it('should revert if sender transfers DPS from someone else\'s account', async() => {});
    it('should transfer funds', async () => {});
  });
});

describe('setSecurity', () => {
  it('should revert if caller is not the owner', async() => {});
  it('should add a new security (to change transfer rules)', async() => {});
})
});
