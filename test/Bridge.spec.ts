import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { keccak256 } from '@ethersproject/keccak256';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { IERC20Metadata } from '../typings/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata';
import { Bridge } from '../typings/contracts/Bridge';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { Eligibility } from '../typings/contracts/Eligibility';
import { LockingSecurity } from '../typings/contracts/LockingSecurity';
import { createERC20Agent, ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe('Bridge', () => {
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let SQR: IERC20Metadata;
  let Security: LockingSecurity;
  let eligibility: Eligibility;
  let bridge: Bridge;

  let agentDPS: ERC20Agent;
  let agentSQR: ERC20Agent;

  beforeEach(async () => {
    ({ accounts, Security, DPS, agentDPS } = await setup());

    const SquareFactory = await ethers.getContractFactory('Square');
    SQR = (await SquareFactory.deploy()) as unknown as IERC20Metadata;
    agentSQR = await createERC20Agent(SQR);

    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();

    const BridgeFactory = await ethers.getContractFactory('Bridge');
    bridge = await BridgeFactory.deploy(DPS.address, SQR.address, eligibility.address);

    await Security.grantRole(ethers.utils.id('SALE'), bridge.address);

    await SQR.transfer(bridge.address, agentSQR.unit(100000));
    await DPS.transfer(bridge.address, agentDPS.unit(100000));
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      const BridgeFactory = await ethers.getContractFactory('Bridge');
      await expect(BridgeFactory.deploy(ZERO_ADDRESS, SQR.address, eligibility.address)).to.be.revertedWith(
        'Bridge: token is zero',
      );
    });

    it('should revert if the stable coin contract is the zero address', async () => {
      const BridgeFactory = await ethers.getContractFactory('Bridge');
      await expect(BridgeFactory.deploy(DPS.address, ZERO_ADDRESS, eligibility.address)).to.be.revertedWith(
        'Bridge: stablecoin is zero',
      );
    });

    it('should revert if the eligibility contract is the zero address', async () => {
      const BridgeFactory = await ethers.getContractFactory('Bridge');
      await expect(BridgeFactory.deploy(DPS.address, SQR.address, ZERO_ADDRESS)).to.be.revertedWith(
        'Bridge: eligibility is zero',
      );
    });

    it('should initialize state variables properly', async () => {
      const BridgeFactory = await ethers.getContractFactory('Bridge');
      const bridge = await BridgeFactory.deploy(DPS.address, SQR.address, eligibility.address);

      expect(await bridge.DPS()).to.equal(DPS.address);
      expect(await bridge.SQR()).to.equal(SQR.address);
      expect(await bridge.eligibility()).to.equal(eligibility.address);
    });
  });

  describe('setEligibility', () => {
    it('should set the new eligibility contract address', async () => {
      await bridge.setEligibility('0x0000000000000000000000000000000000000001');
      expect(await bridge.eligibility()).to.equal('0x0000000000000000000000000000000000000001');
    });
  });

  describe('swapDPSToSQR', () => {
    it('should swap DPS to SQR', async () => {
      const amount = BigNumber.from(50000);
      await eligibility.setResult(accounts[0].address, {
        tier: 3,
        validator: 'Jumio Corporation',
        transactionId: keccak256(randomBytes(16)),
      });
      await DPS.transfer(accounts[0].address, amount);
      await DPS.connect(accounts[0]).approve(bridge.address, amount);

      expect(await bridge.connect(accounts[0]).swapDPStoSQR(amount))
        .to.emit(bridge, 'SwapDPSToSQR')
        .withArgs(accounts[0].address, amount);
      await agentDPS.expectBalanceOf(accounts[0], 0);
      await agentSQR.expectBalanceOf(accounts[0], amount);
    });
  });

  describe('swapSQRtoDPS', () => {
    it('should revert when threshold is not reached', async () => {
      await expect(bridge.connect(accounts[0]).swapSQRtoDPS(20000)).to.revertedWith(
        'Bridge: total balances are not below minimum',
      );
    });
    it('should revert if sender has no KYC', async () => {
      await SQR.transfer(accounts[0].address, agentSQR.unit(50000));
      await expect(bridge.connect(accounts[0]).swapSQRtoDPS(20000)).to.revertedWith(
        'Bridge: amount exceeds permitted limit',
      );
    });
    it('should revert if amount exceeds permitted limit', async () => {
      await SQR.transfer(accounts[0].address, agentSQR.unit(50000));
      await eligibility.setResult(accounts[0].address, {
        tier: 1,
        validator: 'Jumio Corporation',
        transactionId: keccak256(randomBytes(16)),
      });
      await expect(bridge.connect(accounts[0]).swapSQRtoDPS(agentDPS.unit(20000))).to.revertedWith(
        'Bridge: amount exceeds permitted limit',
      );
    });
    it('should swap SQR to DPS', async () => {
      await SQR.transfer(accounts[0].address, agentSQR.unit(50000));
      const amount = agentSQR.unit(30000);
      await eligibility.setResult(accounts[0].address, {
        tier: 3,
        validator: 'Jumio Corporation',
        transactionId: keccak256(randomBytes(16)),
      });
      await SQR.connect(accounts[0]).approve(bridge.address, amount);
      await expect(bridge.connect(accounts[0]).swapSQRtoDPS(amount))
        .to.emit(bridge, 'SwapSQRToDPS')
        .withArgs(accounts[0].address, amount);
      await agentDPS.expectBalanceOf(accounts[0], amount);
      await agentSQR.expectBalanceOf(accounts[0], agentSQR.unit(20000));
    });
  });
});
