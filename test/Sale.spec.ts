import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { createERC20Agent, ERC20Agent } from './utils/ERC20';
import { ZERO_ADDRESS } from './utils/constants';

describe('Sale', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let STC: Contract;
  let eligibility: Contract;
  let sale: Contract;

  let agentDPS: ERC20Agent;
  let agentSTC: ERC20Agent;

  const INITIAL_ROUND = ethers.utils.parseUnits('7000000', 18); // 7M DPS

  async function setupAccount(
    account: SignerWithAddress,
    config: Partial<{ balanceSTC: number; approved: number; tier: number }>,
  ) {
    if (config.balanceSTC && config.balanceSTC > 0) {
      await agentSTC.transfer(account, config.balanceSTC);
    }

    if (config.approved && config.approved > 0) {
      await STC.connect(account).approve(sale.address, agentSTC.unit(config.approved));
    }

    if (config.tier && config.tier > 0) {
      await eligibility.setResult(account.address, {
        tier: config.tier,
        validator: 'Jumio Corporation',
        transactionId: ethers.utils.keccak256(randomBytes(16)),
      });
    }
  }

  beforeEach(async () => {
    [owner, ...accounts] = await ethers.getSigners();

    const SecurityFactory = await ethers.getContractFactory('SpenderSecurity');
    const security = await SecurityFactory.deploy();

    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    DPS = await DeepSquareFactory.deploy(security.address);
    agentDPS = await createERC20Agent(DPS);

    const BridgeTokenFactory = await ethers.getContractFactory('BridgeToken');
    STC = await BridgeTokenFactory.deploy(); // 1 billion STC
    agentSTC = await createERC20Agent(STC);
    await STC.mint(owner.address, agentSTC.unit(1e9), ZERO_ADDRESS, 0, ethers.utils.id('genesis'));

    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();

    const SaleFactory = await ethers.getContractFactory('Sale');
    sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40, 0);
    await security.grantRole(ethers.utils.id('SPENDER'), sale.address);

    // Initial funding of the sale contract
    await DPS.transfer(sale.address, INITIAL_ROUND);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(SaleFactory.deploy(ZERO_ADDRESS, STC.address, eligibility.address, 40, 0)).to.be.revertedWith(
        'Sale: token is zero',
      );
    });

    it('should revert if the stable coin contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(SaleFactory.deploy(DPS.address, ZERO_ADDRESS, eligibility.address, 40, 0)).to.be.revertedWith(
        'Sale: stablecoin is zero',
      );
    });

    it('should revert if the eligibility contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(SaleFactory.deploy(DPS.address, STC.address, ZERO_ADDRESS, 40, 0)).to.be.revertedWith(
        'Sale: eligibility is zero',
      );
    });

    it('should revert if the rate is not greater than zero', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 0, 0)).to.be.revertedWith(
        'Sale: rate is not positive',
      );
    });
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

  describe('buyTokens', () => {
    it('should let user buy DPS tokens against stablecoin and emit a Purchase event', async () => {
      const initialSold: BigNumber = await sale.sold();
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await agentDPS.expectBalanceOf(accounts[0], 0);
      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(1000)))
        .to.emit(sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(2500));

      await agentDPS.expectBalanceOf(accounts[0], 2500);
      await agentSTC.expectBalanceOf(accounts[0], 19000);

      expect(await sale.sold()).to.equals(
        initialSold.add(await DPS.balanceOf(accounts[0].address)),
        'sold state is not incremented',
      );
    });

    it('should revert if owner is the owner', async () => {
      await expect(sale.buyTokens(agentSTC.unit(1000))).to.be.revertedWith('Sale: investor is the sale owner');
    });

    it('should revert if owner is not eligible', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 0 });

      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in a single transaction', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      // tier 1 is 15k STC
      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(16000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in multiple transactions', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(8000))).to.not.be.reverted;
      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(7000))).to.not.be.reverted;
      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if the sender has not given enough allowance', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 500, tier: 1 });

      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(1000))).to.be.revertedWith(
        'ERC20: transfer amount exceeds allowance',
      );
    });

    it('should revert if there are not enough DPS tokens left', async () => {
      // accounts[1] will buy all the tokens except 800 STC
      await setupAccount(accounts[1], { balanceSTC: 1e8, approved: 1e8, tier: 3 });
      const remainingSTC: BigNumber = await sale.convertDPStoSTC(await sale.remaining());
      await sale.connect(accounts[1]).buyTokens(remainingSTC.sub(agentSTC.unit(800)));
      expect(await sale.convertDPStoSTC(await sale.remaining())).to.equals(agentSTC.unit(800));

      // accounts[0] attempts to buy for 1000 STC
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(sale.connect(accounts[0]).buyTokens(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: no enough tokens remaining',
      );
    });
  });

  describe('deliverTokens', () => {
    it('should deliver tokens to the investor and emit a Purchase event', async () => {
      await setupAccount(accounts[0], { tier: 1 });
      await expect(sale.deliverTokens(agentSTC.unit(1000), accounts[0].address))
        .to.emit(sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(2500));
    });

    it('should revert if caller is not the owner', async () => {
      await setupAccount(accounts[0], { tier: 1 });
      await expect(
        sale.connect(accounts[0]).deliverTokens(agentSTC.unit(1000), accounts[0].address),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should revert if beneficiary is the owner', async () => {
      await setupAccount(owner, { tier: 1 });
      await expect(sale.deliverTokens(agentSTC.unit(1000), owner.address)).to.be.revertedWith(
        'Sale: investor is the sale owner',
      );
    });

    it('should revert if beneficiary is not eligible', async () => {
      await expect(sale.deliverTokens(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });

    it('should revert if beneficiary max investment is reached', async () => {
      await setupAccount(accounts[0], { tier: 1 });

      await expect(sale.deliverTokens(agentSTC.unit(7000), accounts[0].address))
        .to.emit(sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(17500));
      await expect(sale.deliverTokens(agentSTC.unit(8000), accounts[0].address))
        .to.emit(sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(20000));
      await expect(sale.deliverTokens(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if there are not enough DPS tokens left', async () => {
      await setupAccount(accounts[3], { tier: 3 });
      const remainingSTC: BigNumber = await sale.convertDPStoSTC(await sale.remaining());
      await sale.deliverTokens(remainingSTC, accounts[3].address);

      await setupAccount(accounts[0], { tier: 1 });
      await expect(sale.deliverTokens(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: no enough tokens remaining',
      );
    });
  });

  describe('close', () => {
    it('should transfer all its DPS to DPS owner and renounce ownership', async () => {
      const remaining = await sale.remaining();
      const saleOwner = await sale.owner();
      const initialBalance = await DPS.balanceOf(saleOwner);

      await sale.close();

      expect(await sale.owner()).to.equals(ZERO_ADDRESS);
      expect(await DPS.balanceOf(await sale.address)).to.equals(0);
      expect(await DPS.balanceOf(saleOwner)).to.equals(initialBalance.add(remaining));
    });
  });
});
