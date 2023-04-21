import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { describe } from 'mocha';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { id } from '@ethersproject/hash';
import { keccak256 } from '@ethersproject/keccak256';
import { parseEther, parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { Sale } from '../typings/contracts/Sale';
import { SpenderSecurity } from '../typings/contracts/SpenderSecurity';
import { Eligibility } from '../typings/contracts/legacy/v1.2/Eligibility';
import { BridgeToken } from '../typings/contracts/vendor/BridgeToken.sol/BridgeToken';
import { AggregatorV3Interface__factory } from '../typings/factories/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface__factory';
import { Eligibility__factory } from '../typings/factories/contracts/Eligibility__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';
import { BridgeToken__factory } from '../typings/factories/contracts/vendor/BridgeToken.sol/BridgeToken__factory';
import { createERC20Agent, ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe('Sale', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let STC: BridgeToken;
  let Security: SpenderSecurity;
  let Eligibility: Eligibility;
  let MockAggregator: MockContract;
  let Sale: Sale;

  let agentDPS: ERC20Agent;
  let agentSTC: ERC20Agent;

  const DEFAULT_AGGREGATOR_DECIMALS = 8; // I.e. 1e8 <=> 1 USD/AVAX
  const INITIAL_ROUND = parseUnits('7000000', 18); // 7M DPS
  let MINIMUM_PURCHASE_STC: BigNumber; // $250

  async function setupAccount(
    account: SignerWithAddress,
    config: Partial<{ balanceSTC: number; approved: number; tier: number }>,
  ) {
    if (config.balanceSTC && config.balanceSTC > 0) {
      await agentSTC.transfer(account, config.balanceSTC);
    }

    if (config.approved && config.approved > 0) {
      await STC.connect(account).approve(Sale.address, agentSTC.unit(config.approved));
    }

    if (config.tier && config.tier > 0) {
      await Eligibility.setResult(account.address, {
        tier: config.tier,
        validator: 'Jumio Corporation',
        transactionId: keccak256(randomBytes(16)),
      });
    }
  }

  beforeEach(async () => {
    ({ owner, accounts, Security, DPS, agentDPS } = await setup());

    // Deploy a fake USDC.e
    STC = await new BridgeToken__factory(owner).deploy(); // 1 billion STC
    agentSTC = await createERC20Agent(STC);
    await (STC as unknown as Contract).mint(owner.address, agentSTC.unit(1e9), ZERO_ADDRESS, 0, id('genesis'));

    MINIMUM_PURCHASE_STC = agentSTC.unit(250);

    Eligibility = await new Eligibility__factory(owner).deploy();

    MockAggregator = await deployMockContract(owner, AggregatorV3Interface__factory.abi);
    await MockAggregator.mock.latestRoundData.returns(314, parseUnits('100', 8), 314, 314, 314); // Default mock rate value (1 AVAX <=> 100 USD)
    await MockAggregator.mock.decimals.returns(DEFAULT_AGGREGATOR_DECIMALS);

    Sale = await new Sale__factory(owner).deploy(
      DPS.address,
      STC.address,
      MockAggregator.address,
      40,
      MINIMUM_PURCHASE_STC,
      0,
    );
    await Security.grantRole(id('SPENDER'), Sale.address);

    // Initial funding of the sale contract
    await DPS.transfer(Sale.address, INITIAL_ROUND);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(
        new Sale__factory(owner).deploy(ZERO_ADDRESS, STC.address, MockAggregator.address, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: token is zero');
    });

    it('should revert if the stable coin contract is the zero address', async () => {
      await expect(
        new Sale__factory(owner).deploy(DPS.address, ZERO_ADDRESS, MockAggregator.address, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: stablecoin is zero');
    });

    it('should revert if the aggregator contract is the zero address', async () => {
      await expect(
        new Sale__factory(owner).deploy(DPS.address, STC.address, ZERO_ADDRESS, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: aggregator is zero');
    });

    it('should revert if the rate is not greater than zero', async () => {
      await expect(
        new Sale__factory(owner).deploy(DPS.address, STC.address, MockAggregator.address, 0, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: rate is not positive');
    });
  });

  describe('setAggregator', () => {
    it('should change the Chainlink aggregator address', async () => {
      const newAggregator = '0xa5409ec958C83C3f309868babACA7c86DCB077c1';
      expect(await Sale.aggregator()).to.not.equals(newAggregator);
      await Sale.setAggregator(newAggregator);
      expect(await Sale.aggregator()).to.equals(newAggregator);
    });
  });

  describe('convertAVAXtoSTC', () => {
    [
      [1, 99.7, 99700000],
      [1, 97.83007, 97830070],
      [2, 100.0, 200000000],
    ].forEach(async ([amountAVAX, rate, amountUSD]) => {
      const parsedAVAX = parseUnits(amountAVAX.toString(), 18);

      it(`should convert ${amountAVAX} AVAX to ${amountUSD} USD with rate ${rate}`, async () => {
        await MockAggregator.mock.latestRoundData.returns(
          314,
          parseUnits(rate.toString(), DEFAULT_AGGREGATOR_DECIMALS), // Rate is in USD/AVAX
          314,
          314,
          314,
        );

        expect(await Sale.convertAVAXtoSTC(parsedAVAX)).to.equals(amountUSD);
      });
    });

    it('should revert if the aggregator answer is not strictly positive', async () => {
      await MockAggregator.mock.latestRoundData.returns(314, -1, 314, 314, 314);
      expect(Sale.convertAVAXtoSTC(parseEther('1'))).to.revertedWith('Sale: answer cannot be negative');
    });
  });

  describe('convertDPStoSTC', () => {
    [
      [1000, 2500],
      [5000, 12500],
    ].forEach(([amountSTC, amountDPS]) => {
      const parsedSTC = parseUnits(amountSTC.toString(), 6);
      const parsedDPS = parseUnits(amountDPS.toString(), 18);

      it(`should convert ${amountDPS} DPS to ${amountSTC} STC`, async () => {
        expect(await Sale.convertDPStoSTC(parsedDPS)).to.equals(parsedSTC);
      });
    });
  });

  describe('convertSTCtoDPS', () => {
    [
      [1000, 2500],
      [5000, 12500],
    ].forEach(([amountSTC, amountDPS]) => {
      const parsedSTC = parseUnits(amountSTC.toString(), 6);
      const parsedDPS = parseUnits(amountDPS.toString(), 18);

      it(`should convert ${amountSTC} STC to ${amountDPS} DPS`, async () => {
        expect(await Sale.convertSTCtoDPS(parsedSTC)).to.equals(parsedDPS);
      });
    });
  });

  describe('remaining', () => {
    it('should display the remaining DPS amount', async () => {
      expect(await Sale.remaining()).to.equal(INITIAL_ROUND);
    });
  });

  describe('raised', () => {
    it('should display the raised stablecoin amount', async () => {
      expect(await Sale.raised()).to.equal(0);
    });
  });

  describe('purchaseDPSWithAVAX', () => {
    it('should let user buy DPS tokens against AVAX and emit a Purchase event', async () => {
      await setupAccount(accounts[0], { balanceSTC: 30000, approved: 20000, tier: 3 });
      await MockAggregator.mock.latestRoundData.returns(314, parseUnits('70', 8), 314, 314, 314);
      await ethers.provider.send('hardhat_setBalance', [accounts[0].address, parseUnits('2000', 18).toHexString()]);

      const initialOwnerBalance = await owner.getBalance();
      const initialSold = await Sale.sold();

      const amountAVAX = parseUnits('1000', 18); // 1000 AVAX
      const amountDPS = await Sale.convertSTCtoDPS(await Sale.convertAVAXtoSTC(amountAVAX));

      await agentDPS.expectBalanceOf(accounts[0], 0);
      await expect(Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: amountAVAX }))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, amountDPS);

      await agentDPS.expectBalanceOf(accounts[0], amountDPS);
      expect((await accounts[0].getBalance()).lt(parseUnits('1000', 18))).to.be.true;
      expect(await owner.getBalance()).to.equals(initialOwnerBalance.add(amountAVAX));

      expect(await Sale.sold()).to.equals(
        initialSold.add(await DPS.balanceOf(accounts[0].address)),
        'sold state is not incremented',
      );
    });

    it('should revert if investor is the owner', async () => {
      await expect(Sale.purchaseDPSWithAVAX({ value: parseUnits('1000', 18) })).to.be.revertedWith(
        'Sale: investor is the sale owner',
      );
    });

    it('should revert if investor tries to buy less that the minimum purchase', async () => {
      await expect(
        Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: parseUnits('1', 18) }), // 1 AVAX
      ).to.be.revertedWith('Sale: amount lower than minimum');
    });

    it('should revert if sale is paused', async () => {
      await Sale.setPause(true);
      await expect(Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: parseUnits('1000', 18) })).to.be.revertedWith(
        'Sale is paused',
      );
    });

    it('should revert if investor is not eligible', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 0 });
      await ethers.provider.send('hardhat_setBalance', [accounts[0].address, parseUnits('2000', 18).toHexString()]);

      await expect(Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: parseUnits('1000', 18) })).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });
  });

  describe('purchaseDPSWithSTC', () => {
    it('should let user buy DPS tokens against stablecoin and emit a Purchase event', async () => {
      const initialSold: BigNumber = await Sale.sold();
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await agentDPS.expectBalanceOf(accounts[0], 0);
      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000)))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(2500));

      await agentDPS.expectBalanceOf(accounts[0], 2500);
      await agentSTC.expectBalanceOf(accounts[0], 19000);

      expect(await Sale.sold()).to.equals(
        initialSold.add(await DPS.balanceOf(accounts[0].address)),
        'sold state is not incremented',
      );
    });

    it('should revert if investor is the owner', async () => {
      await expect(Sale.purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith('Sale: investor is the sale owner');
    });

    it('should revert if investor tries to buy less that the minimum purchase', async () => {
      await expect(Sale.purchaseDPSWithSTC(agentSTC.unit(100))).to.be.revertedWith('Sale: amount lower than minimum');
    });

    it('should revert if sale is paused', async () => {
      await Sale.setPause(true);
      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale is paused',
      );
    });

    it('should revert if investor is not eligible', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 0 });

      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in a single transaction', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      // tier 1 is 15k STC
      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(16000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in multiple transactions', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(8000))).to.not.be.reverted;
      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(7000))).to.not.be.reverted;
      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if the sender has not given enough allowance', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 500, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith(
        'ERC20: transfer amount exceeds allowance',
      );
    });

    it('should revert if there are not enough DPS tokens left', async () => {
      // accounts[1] will buy all the tokens except 800 STC
      await setupAccount(accounts[1], { balanceSTC: 1e8, approved: 1e8, tier: 3 });
      const remainingSTC: BigNumber = await Sale.convertDPStoSTC(await Sale.remaining());
      await Sale.connect(accounts[1]).purchaseDPSWithSTC(remainingSTC.sub(agentSTC.unit(800)));
      expect(await Sale.convertDPStoSTC(await Sale.remaining())).to.equals(agentSTC.unit(800));

      // accounts[0] attempts to buy for 1000 STC
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPSWithSTC(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: no enough tokens remaining',
      );
    });
  });

  describe('deliverDPS', () => {
    it('should deliver tokens to the investor and emit a Purchase event', async () => {
      await setupAccount(accounts[0], { tier: 1 });
      await expect(Sale.deliverDPS(agentSTC.unit(1000), accounts[0].address))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(2500));
    });

    it('should revert if caller is not the owner', async () => {
      await setupAccount(accounts[0], { tier: 1 });
      await expect(Sale.connect(accounts[0]).deliverDPS(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('should revert if beneficiary is the owner', async () => {
      await setupAccount(owner, { tier: 1 });
      await expect(Sale.deliverDPS(agentSTC.unit(1000), owner.address)).to.be.revertedWith(
        'Sale: investor is the sale owner',
      );
    });

    it('should revert if beneficiary is not eligible', async () => {
      await expect(Sale.deliverDPS(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });

    it('should revert if beneficiary max investment is reached', async () => {
      await setupAccount(accounts[0], { tier: 1 });

      await expect(Sale.deliverDPS(agentSTC.unit(7000), accounts[0].address))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(17500));
      await expect(Sale.deliverDPS(agentSTC.unit(8000), accounts[0].address))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, agentDPS.unit(20000));
      await expect(Sale.deliverDPS(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if there are not enough DPS tokens left', async () => {
      await setupAccount(accounts[3], { tier: 3 });
      const remainingSTC: BigNumber = await Sale.convertDPStoSTC(await Sale.remaining());
      await Sale.deliverDPS(remainingSTC, accounts[3].address);

      await setupAccount(accounts[0], { tier: 1 });
      await expect(Sale.deliverDPS(agentSTC.unit(1000), accounts[0].address)).to.be.revertedWith(
        'Sale: no enough tokens remaining',
      );
    });
  });

  describe('pause', () => {
    it('should revert if caller is not the owner', async () => {
      await expect(Sale.connect(accounts[0]).setPause(true)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('close', () => {
    it('should transfer all its DPS to DPS owner and renounce ownership', async () => {
      const remaining = await Sale.remaining();
      const saleOwner = await Sale.owner();
      const initialBalance = await DPS.balanceOf(saleOwner);

      await Sale.close();

      expect(await Sale.owner()).to.equals(ZERO_ADDRESS);
      expect(await DPS.balanceOf(Sale.address)).to.equals(0);
      expect(await DPS.balanceOf(saleOwner)).to.equals(initialBalance.add(remaining));
    });
    it('should have the correct sold amount', async () => {
      await setupAccount(accounts[0], { tier: 1 });
      await Sale.deliverDPS(agentSTC.unit(1000), accounts[0].address);
      const initialSold = await Sale.sold();
      await Sale.close();
      expect(await Sale.sold()).to.equals(initialSold);
    });
  });
});
