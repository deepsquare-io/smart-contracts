import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { createERC20Agent, ERC20Agent } from './utils/ERC20';

describe('Sale', () => {
  let owner: SignerWithAddress;
  let kycWriter: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let STC: Contract;
  let eligibility: Contract;
  let sale: Contract;

  let agentDPS: ERC20Agent;
  let agentSTC: ERC20Agent;

  const INITIAL_ROUND = ethers.utils.parseUnits('7000000', 18); // 7M DPS

  beforeEach(async () => {
    [owner, kycWriter, ...accounts] = await ethers.getSigners();

    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy();
    agentDPS = createERC20Agent(DPS);

    const TestERC20Factory = await ethers.getContractFactory('TestERC20');
    STC = await TestERC20Factory.deploy(BigNumber.from(1e9).mul(1e6)); // 1 billion STC
    agentSTC = createERC20Agent(STC);

    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();

    const SaleFactory = await ethers.getContractFactory('Sale');
    sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40);

    // Initial funding of the sale contract
    await DPS.transfer(sale.address, INITIAL_ROUND);
    await DPS.grantRole(ethers.utils.id('SPENDER'), sale.address);
  });

  describe('concertSTCtoDPS', () => {
    [
      [1000, 2500],
      [5000, 12500],
    ].forEach(([amountSTC, amountDPS]) => {
      const parsedSTC = ethers.utils.parseUnits(amountSTC.toString(), 6);
      const parsedDPS = ethers.utils.parseUnits(amountDPS.toString(), 18);

      it(`should convert ${amountSTC} STC to ${amountDPS} DPS`, async () => {
        expect(await sale.convertSTCtoDPS(parsedSTC)).to.equals(parsedDPS);
      });

      it(`should convert ${amountDPS} DPS to ${amountSTC} STC`, async () => {
        expect(await sale.convertDPStoSTC(parsedDPS)).to.equals(parsedSTC);
      });
    });
  });

  describe('remaining', () => {
    it('should display the initial sale amount', async () => {
      expect(await sale.remaining()).to.equal(INITIAL_ROUND);
    });
  });

  describe('buyTokens', () => {
    it('should let accounts buy DPS tokens', async () => {
      // Prepare the account
      await agentSTC.transfer(accounts[0], 1000);

      // Approve the stableCoin
      await STC.connect(accounts[0]).approve(sale.address, agentSTC.parseUnit(100000));

      // Buy tokens
      await agentDPS.expectBalanceOf(accounts[0], 0);
      await agentSTC.expectBalanceOf(accounts[0], 1000);

      await sale.connect(accounts[0]).buyTokens(agentSTC.parseUnit(1000));

      await agentDPS.expectBalanceOf(accounts[0], 2500);
      await agentSTC.expectBalanceOf(accounts[0], 0);
    });
  });
});
