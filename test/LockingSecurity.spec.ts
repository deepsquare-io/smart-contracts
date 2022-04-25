import { expect } from 'chai';
import { describe } from 'mocha';
import { id } from '@ethersproject/hash';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { LockingSecurity } from '../typings/contracts/LockingSecurity';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe.only('LockingSecurity', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;
  let Security: LockingSecurity;

  beforeEach(async () => {
    ({ owner, accounts, Security, DPS, agentDPS } = await setup());
  });

  describe('upgradeBridge', async () => {
    it('should upgrade the bridge address', async () => {
      await Security.upgradeBridge('0x0000000000000000000000000000000000000001');
      expect(await Security.bridge()).to.equal('0x0000000000000000000000000000000000000001');
    });
  });

  describe('locked', () => {
    it("should return account's locked funds", async () => {
      const now = Math.floor(Date.now() / 1000);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(100),
        release: now + 3600,
      });
      expect(await Security.locked(accounts[0].address, now)).to.equals(agentDPS.unit(100));
    });
  });

  describe('available', () => {
    it('should return 0 if the locked amount is greater thant the account balance', async () => {
      const now = Math.floor(Date.now() / 1000);
      await agentDPS.transfer(accounts[0], 10);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(100),
        release: now + 3600,
      });
    });
    it('should return how much DPS is available', async () => {
      const now = Math.floor(Date.now() / 1000);

      await agentDPS.transfer(accounts[0], 100);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(10),
        release: now + 3600,
      });

      expect(await Security.available(accounts[0].address, now)).to.equals(agentDPS.unit(90));
    });
  });

  describe('lock', () => {
    it('should lock 10,000 DPS for the account #0', async () => {
      const now = Math.floor(Date.now() / 1000);
      await agentDPS.transfer(accounts[0], 10);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(10),
        release: now + 3600,
      });

      expect(await Security.locked(accounts[0].address, now)).to.equals(agentDPS.unit(10));
      expect(await Security.available(accounts[0].address, now)).to.equals(0);
    });
  });

  describe('validateTokenTransfer', async () => {
    it('should return if the sender is the bridge', async () => {
      await expect(
        Security.validateTokenTransfer(ZERO_ADDRESS, accounts[0].address, accounts[1].address, agentDPS.unit(10)),
      ).to.not.reverted;
    });
    it('should return if the sender has the role DEFAULT_ADMIN_ROLE', async () => {
      await expect(Security.validateTokenTransfer(owner.address, owner.address, accounts[0].address, agentDPS.unit(10)))
        .to.not.be.reverted;
    });
    it('should return if the sender has the role SALE', async () => {
      await Security.grantRole(id('SALE'), accounts[0].address);
      await expect(
        Security.connect(accounts[0].address).validateTokenTransfer(
          accounts[0].address,
          accounts[0].address,
          accounts[0].address,
          agentDPS.unit(10),
        ),
      ).to.not.be.reverted;
    });
    it('should reverse if the recipient is not the bridge', async () => {
      await expect(
        Security.validateTokenTransfer(
          accounts[0].address,
          accounts[1].address,
          accounts[2].address,
          agentDPS.unit(10),
        ),
      ).to.be.revertedWith('LockingSecurity: destination is not the bridge');
    });
    it("should reverse if the sender's funds are too low", async () => {
      const now = Math.floor(Date.now() / 1000);
      await agentDPS.transfer(accounts[0], 10);
      await Security.lock(accounts[0].address, { value: agentDPS.unit(2), release: now + 3600 });
      const bridgeAddress = await Security.bridge();

      await expect(
        Security.validateTokenTransfer(accounts[0].address, accounts[0].address, bridgeAddress, agentDPS.unit(9)),
      ).to.be.revertedWith('LockingSecurity: transfer amount exceeds available tokens');
    });
    it('should pass', async () => {
      await agentDPS.transfer(accounts[0], agentDPS.unit(10));
      const bridgeAddress = await Security.bridge();

      await expect(
        Security.validateTokenTransfer(accounts[0].address, accounts[0].address, bridgeAddress, agentDPS.unit(4)),
      ).not.reverted;
    });
  });

  describe('vest', () => {
    it('should lock and transfer DPS to the investor', async () => {
      const now = Math.floor(Date.now() / 1000);
      await Security.grantRole(id('SALE'), Security.address);
      await agentDPS.transfer(Security.address, agentDPS.unit(20000));
      await Security.vest(accounts[1].address, {
        value: agentDPS.unit(10000),
        release: now + 3600,
      });
      expect(await Security.locked(accounts[1].address, now)).to.equals(agentDPS.unit(10000));
      expect(await Security.available(accounts[1].address, now)).to.equals(0);
      expect(await DPS.balanceOf(accounts[1].address)).to.equals(agentDPS.unit(10000));
    });
  });
});
