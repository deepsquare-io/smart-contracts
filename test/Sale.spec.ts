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
  const SPENDER_ROLE = ethers.utils.id('SPENDER');

  beforeEach(async () => {
    [owner, kycWriter, ...accounts] = await ethers.getSigners();



    const SecurityFactory = await ethers.getContractFactory('SpenderSecurity');
    const security = await SecurityFactory.deploy();

    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy(security.address);
    agentDPS = createERC20Agent(DPS);

    const TestERC20Factory = await ethers.getContractFactory('BridgeToken');
    STC = await TestERC20Factory.deploy(); // 1 billion STC
    agentSTC = createERC20Agent(STC);

    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();

    const SaleFactory = await ethers.getContractFactory('Sale');
    sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40, 0);

    // Initial funding of the sale contract
    await DPS.transfer(sale.address, INITIAL_ROUND);
  });

  describe('on initialization', () => {
    it('should revert if dps contract is the zero address', async () => {});
    it('should revert if stablecoin contract is the zero address', async () => {});
    it('should revert if rate is not greather than 0', async () => {});
    it('should set initial sold amount', async () => {});
  });


  describe('buyTokens', () => {
    it('should revert if sender is the owner', async () => {});
    it('should revert if sender has not passed KYC', async () => {});
    it('should revert if SBC amount is greater than tier limit', async () => {});
    it('should revert if dps amount exceeds contract dps amount', async () => {});
    
    it.skip('should let user buy DPS tokens against its stablecoin', async () => {
      // Prepare the account
      await agentSTC.transfer(accounts[0], 1000);
      
      // Mark accounts as eligible
      await eligibility.setResult({});
      
      // Approve the stableCoin
      await STC.connect(accounts[0]).approve(sale.address, agentSTC.parseUnit(100000));
      
      // Buy tokens
      await agentDPS.expectBalanceOf(accounts[0], 0);
      await agentSTC.expectBalanceOf(accounts[0], 1000);
      
      await sale.connect(accounts[0]).buyTokens(agentSTC.parseUnit(1000));
      
      await agentDPS.expectBalanceOf(accounts[0], 2500);
      await agentSTC.expectBalanceOf(accounts[0], 0);
    });
    it('should increase the "sold DPS" amount variable', async () => {});
    it('should emit a Purchase event', async () => {});
  });
  
  describe('deliverTokens', () => {
    it('should revert if caller is not the owner', async () => {});
    it('should revert if beneficiary is the owner', async () => {});
    it('should revert if beneficiary has not passed KYC', async () => {});
    it('should revert if DPS amount exceeds contract DPS amount', async () => {});
    it('should revert if SBC amount is greater than tier limit', async () => {});
    it('should increase the "sold DPS" amount variable', async () => {});
    it('should emit a Purchase event', async () => {});
  });

  describe('close', () => {
    it('should transfer all its DPS to DPS owner', async () => {});
    it('should renounce ownership of the contract', async () => {});
  });


  describe('convertDPStoSTC', () => {
    [
      [1000, 2500],
      [5000, 12500],
    ].forEach(([amountSTC, amountDPS]) => {
      const parsedSTC = ethers.utils.parseUnits(amountSTC.toString(), 6);
      const parsedDPS = ethers.utils.parseUnits(amountDPS.toString(), 18);

      it(`should convert ${amountDPS} DPS to ${amountSTC} STC`, async () => {
        expect(await sale.convertDPStoSTC(parsedDPS)).to.equals(parsedSTC);
      });
    });
  });

  describe('convertSTCtoDPS', () => {
    [
      [1000, 2500],
      [5000, 12500],
    ].forEach(([amountSTC, amountDPS]) => {
      const parsedSTC = ethers.utils.parseUnits(amountSTC.toString(), 6);
      const parsedDPS = ethers.utils.parseUnits(amountDPS.toString(), 18);

      it(`should convert ${amountSTC} STC to ${amountDPS} DPS`, async () => {
        expect(await sale.convertSTCtoDPS(parsedSTC)).to.equals(parsedDPS);
      });
    });
  });

  describe('remaining', () => {
    it('should display the remaining DPS amount', async () => {
      expect(await sale.remaining()).to.equal(INITIAL_ROUND);
    });
  });
});
