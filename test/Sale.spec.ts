import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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
    const ERC20Factory = await ethers.getContractFactory('ERC20');
    STC = await ERC20Factory.deploy('USD Coin', 'USDC.e');
    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();
    const SaleFactory = await ethers.getContractFactory('Sale');
    sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, BigNumber.from('250000000'));

    DPS.transferFrom(owner.address, sale.address, INITIAL_ROUND);
  });

  describe('remaining', () => {
    it('should display the initial sale amount', async () => {
      expect(await sale.remaining()).to.equal(INITIAL_ROUND);
    });
  });
});
