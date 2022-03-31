import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { deployMockContract } from 'ethereum-waffle';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { setupDeepSquare } from '../lib/testing/DeepSquare';
import { createERC20Agent, ERC20Agent } from '../lib/testing/ERC20';
import abi from './abi/AggregatorV3Interface.abi.json';

describe('Sale', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;
  let STC: Contract;
  let Security: Contract;
  let Eligibility: Contract;
  let MockAggregator: Contract;
  let Sale: Contract;

  let agentDPS: ERC20Agent;
  let agentSTC: ERC20Agent;

  const DEFAULT_AGGREGATOR_DECIMALS = 8;
  const INITIAL_ROUND = ethers.utils.parseUnits('7000000', 18); // 7M DPS
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
        transactionId: ethers.utils.keccak256(randomBytes(16)),
      });
    }
  }

  beforeEach(async () => {
    ({ owner, accounts, Security, DPS, agentDPS } = await setupDeepSquare());

    const BridgeTokenFactory = await ethers.getContractFactory('BridgeToken');
    STC = await BridgeTokenFactory.deploy(); // 1 billion STC
    agentSTC = await createERC20Agent(STC);
    await STC.mint(owner.address, agentSTC.unit(1e9), ZERO_ADDRESS, 0, ethers.utils.id('genesis'));

    MINIMUM_PURCHASE_STC = agentSTC.unit(250);

    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    Eligibility = await EligibilityFactory.deploy();

    MockAggregator = await deployMockContract(owner, abi);
    await MockAggregator.mock.latestRoundData.returns(314, ethers.utils.parseUnits('100', 8), 314, 314, 314); // Default mock rate value (1 AVAX <=> 100 USD)
    await MockAggregator.mock.decimals.returns(DEFAULT_AGGREGATOR_DECIMALS);

    const SaleFactory = await ethers.getContractFactory('Sale');
    Sale = await SaleFactory.deploy(
      DPS.address,
      STC.address,
      Eligibility.address,
      MockAggregator.address,
      40,
      MINIMUM_PURCHASE_STC,
      0,
    );
    await Security.grantRole(ethers.utils.id('SPENDER'), Sale.address);

    // Initial funding of the sale contract
    await DPS.transfer(Sale.address, INITIAL_ROUND);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(
        SaleFactory.deploy(ZERO_ADDRESS, STC.address, Eligibility.address, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: token is zero');
    });

    it('should revert if the stable coin contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(
        SaleFactory.deploy(DPS.address, ZERO_ADDRESS, Eligibility.address, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: stablecoin is zero');
    });

    it('should revert if the eligibility contract is the zero address', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(
        SaleFactory.deploy(DPS.address, STC.address, ZERO_ADDRESS, 40, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: eligibility is zero');
    });

    it('should revert if the rate is not greater than zero', async () => {
      const SaleFactory = await ethers.getContractFactory('Sale');
      await expect(
        SaleFactory.deploy(DPS.address, STC.address, Eligibility.address, 0, MINIMUM_PURCHASE_STC, 0),
      ).to.be.revertedWith('Sale: rate is not positive');
    });
  });

  describe('convertAVAXtoUSD', () => {
    [
      [1, 9970000000, 99700000],
      [1, 9783007000, 97830070],
      [2, 10000000000, 200000000],
    ].forEach(async ([amountAVAX, rate, amountUSD]) => {
      const parsedAVAX = ethers.utils.parseUnits(amountAVAX.toString(), 18);

      it(`should convert ${amountAVAX} DPS to ${amountUSD} USD with rate ${rate}`, async () => {
        await MockAggregator.mock.latestRoundData.returns(314, rate, 314, 314, 314);
        expect(await Sale.convertAVAXToUSD(parsedAVAX)).to.equals(amountUSD);
      });
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
        expect(await Sale.convertDPStoSTC(parsedDPS)).to.equals(parsedSTC);
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
      await MockAggregator.mock.latestRoundData.returns(314, ethers.utils.parseUnits('70', 8), 314, 314, 314);
      await ethers.provider.send('hardhat_setBalance', [
        accounts[0].address,
        ethers.utils.parseUnits('2000', 18).toHexString(),
      ]);

      const initialOwnerBalance = await owner.getBalance();
      const initialSold = await Sale.sold();

      const amountAVAX = ethers.utils.parseUnits('1000', 18); // 1000 AVAX
      const amountDPS = await Sale.convertSTCToDPS(await Sale.convertAVAXToUSD(amountAVAX));

      await agentDPS.expectBalanceOf(accounts[0], 0);
      await expect(Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: amountAVAX }))
        .to.emit(Sale, 'Purchase')
        .withArgs(accounts[0].address, amountDPS);

      await agentDPS.expectBalanceOf(accounts[0], amountDPS);
      expect((await accounts[0].getBalance()).lt(ethers.utils.parseUnits('1000', 18))).to.be.true;
      expect(await owner.getBalance()).to.equals(initialOwnerBalance.add(amountAVAX));

      expect(await Sale.sold()).to.equals(
        initialSold.add(await DPS.balanceOf(accounts[0].address)),
        'sold state is not incremented',
      );
    });

    it('should revert if investor is the owner', async () => {
      await expect(Sale.purchaseDPSWithAVAX({ value: ethers.utils.parseUnits('1000', 18) })).to.be.revertedWith(
        'Sale: investor is the sale owner',
      );
    });

    it('should revert if investor tries to buy less that the minimum purchase', async () => {
      await expect(
        Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: ethers.utils.parseUnits('1', 18) }), // 1 AVAX
      ).to.be.revertedWith('Sale: amount lower than minimum');
    });

    it('should revert if investor is not eligible', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 0 });
      await ethers.provider.send('hardhat_setBalance', [
        accounts[0].address,
        ethers.utils.parseUnits('2000', 18).toHexString(),
      ]);

      await expect(
        Sale.connect(accounts[0]).purchaseDPSWithAVAX({ value: ethers.utils.parseUnits('1000', 18) }),
      ).to.be.revertedWith('Sale: account is not eligible');
    });
  });

  describe('purchaseDPS', () => {
    it('should let user buy DPS tokens against stablecoin and emit a Purchase event', async () => {
      const initialSold: BigNumber = await Sale.sold();
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await agentDPS.expectBalanceOf(accounts[0], 0);
      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(1000)))
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
      await expect(Sale.purchaseDPS(agentSTC.unit(1000))).to.be.revertedWith('Sale: investor is the sale owner');
    });

    it('should revert if investor tries to buy less that the minimum purchase', async () => {
      await expect(Sale.purchaseDPS(agentSTC.unit(100))).to.be.revertedWith('Sale: amount lower than minimum');
    });

    it('should revert if investor is not eligible', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 0 });

      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: account is not eligible',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in a single transaction', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      // tier 1 is 15k STC
      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(16000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if investor tries to buy more tokens than its tier in multiple transactions', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(8000))).to.not.be.reverted;
      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(7000))).to.not.be.reverted;
      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(1000))).to.be.revertedWith(
        'Sale: exceeds tier limit',
      );
    });

    it('should revert if the sender has not given enough allowance', async () => {
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 500, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(1000))).to.be.revertedWith(
        'ERC20: transfer amount exceeds allowance',
      );
    });

    it('should revert if there are not enough DPS tokens left', async () => {
      // accounts[1] will buy all the tokens except 800 STC
      await setupAccount(accounts[1], { balanceSTC: 1e8, approved: 1e8, tier: 3 });
      const remainingSTC: BigNumber = await Sale.convertDPStoSTC(await Sale.remaining());
      await Sale.connect(accounts[1]).purchaseDPS(remainingSTC.sub(agentSTC.unit(800)));
      expect(await Sale.convertDPStoSTC(await Sale.remaining())).to.equals(agentSTC.unit(800));

      // accounts[0] attempts to buy for 1000 STC
      await setupAccount(accounts[0], { balanceSTC: 20000, approved: 20000, tier: 1 });

      await expect(Sale.connect(accounts[0]).purchaseDPS(agentSTC.unit(1000))).to.be.revertedWith(
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

  describe('close', () => {
    it('should transfer all its DPS to DPS owner and renounce ownership', async () => {
      const remaining = await Sale.remaining();
      const saleOwner = await Sale.owner();
      const initialBalance = await DPS.balanceOf(saleOwner);

      await Sale.close();

      expect(await Sale.owner()).to.equals(ZERO_ADDRESS);
      expect(await DPS.balanceOf(await Sale.address)).to.equals(0);
      expect(await DPS.balanceOf(saleOwner)).to.equals(initialBalance.add(remaining));
    });

    it('should revert if the DPS contract does not have the owner function', async () => {
      // Configure a new Sale contract with a dummy ERC20 token
      const ERC20Factory = await ethers.getContractFactory('@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20');
      const ERC20 = await ERC20Factory.deploy('DeepSquare no owner', 'DPS');
      const SaleFactory = await ethers.getContractFactory('Sale');
      Sale = await SaleFactory.deploy(ERC20.address, STC.address, Eligibility.address, 40, MINIMUM_PURCHASE_STC, 0);
      await Security.grantRole(ethers.utils.id('SPENDER'), Sale.address);

      await expect(Sale.close()).to.be.revertedWith('Sale: unable to determine owner');
    });
  });
});
