import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { ether, usdc } from './utils';

describe('Sale', () => {
  let owner: SignerWithAddress;
  let kycWriter: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let STC: Contract;
  let eligibility: Contract;
  let sale: Contract;

  const INITIAL_ROUND = ethers.utils.parseUnits('7000000', 18); // 7M DPS

  beforeEach(async () => {
    [owner, kycWriter, ...accounts] = await ethers.getSigners();

    const DeepSquareTokenFactory = await ethers.getContractFactory('DeepSquareToken');
    DPS = await DeepSquareTokenFactory.deploy();
    const ERC20Factory = await ethers.getContractFactory('TestERC20');
    STC = await ERC20Factory.deploy(ether(10e9));
    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();
    const SaleFactory = await ethers.getContractFactory('Sale');
    sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, BigNumber.from(2.5e12));

    // 1000e6
    // 2.5
    // 2500e18

    // Initial funding of the sale contract
    await DPS.transferFrom(owner.address, sale.address, INITIAL_ROUND);
    await DPS.addSpender(sale.address);
  });

  describe('remaining', () => {
    it('should display the initial sale amount', async () => {
      expect(await sale.remaining()).to.equal(INITIAL_ROUND);
    });
  });

  describe('buyTokens', () => {
    it('should let accounts buy DPS tokens', async () => {
      // prepare the account
      await STC.transfer(accounts[0].address, usdc(1000));
      expect(await STC.balanceOf(accounts[0].address)).to.equal(usdc(1000));

      // approve the stableCoin
      await STC.connect(accounts[0]).approve(sale.address, usdc(100000));

      // buy tokens
      await sale.connect(accounts[0]).buyTokens(usdc(1000));
      expect(await DPS.balanceOf(accounts[0].address)).to.equal(ether(2500));
    });
  });
});
