import { expect } from 'chai';
import { describe } from 'mocha';
import { BigNumber } from '@ethersproject/bignumber';
import { id } from '@ethersproject/hash';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { LockingSecurity } from '../typings/contracts/LockingSecurity';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';
import time from './testing/time';

import LockStruct = LockingSecurity.LockStruct;

describe('LockingSecurity', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let agentDPS: ERC20Agent;
  let Security: LockingSecurity;

  beforeEach(async () => {
    ({ owner, accounts, Security, DPS, agentDPS } = await setup());
  });

  describe('constructor', () => {
    it('should be initialized with proper values', async () => {
      expect(await Security.DPS()).to.equals(DPS.address);
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
        Security.connect(accounts[0]).validateTokenTransfer(
          accounts[0].address,
          accounts[0].address,
          accounts[0].address,
          agentDPS.unit(10),
        ),
      ).to.not.be.reverted;
    });

    it('should revert if the recipient is not the bridge', async () => {
      await expect(
        Security.validateTokenTransfer(
          accounts[0].address,
          accounts[1].address,
          accounts[2].address,
          agentDPS.unit(10),
        ),
      ).to.be.revertedWith('LockingSecurity: destination is not the bridge');
    });

    it("should revert if the sender's funds are too low", async () => {
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

  describe('upgradeBridge', async () => {
    it('should upgrade the bridge address', async () => {
      await Security.upgradeBridge('0x0000000000000000000000000000000000000001');
      expect(await Security.bridge()).to.equal('0x0000000000000000000000000000000000000001');
    });
  });

  describe('locks', async () => {
    it('should return the locks details for given address', async () => {
      const lock1: LockStruct = { value: 1, release: 2 };
      const lock2: LockStruct = { value: 3, release: 4 };

      await Security.lock(accounts[0].address, lock1);
      await Security.lock(accounts[0].address, lock2);

      expect(await Security.locks(accounts[0].address)).to.deep.equals([
        [BigNumber.from(lock1.value), BigNumber.from(lock1.release)],
        [BigNumber.from(lock2.value), BigNumber.from(lock2.release)],
      ]);
    });
  });

  describe('schedule', () => {
    it("should return an investor's locks", async () => {
      const now = Math.floor(Date.now() / 1000);
      await agentDPS.transfer(accounts[0], 10);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(10),
        release: now + 3600,
      });
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(10),
        release: now - 3600,
      });

      const actualLocks = await Security.schedule(accounts[0].address, now);

      expect(actualLocks[0].release).to.equals(now + 3600);
      expect(actualLocks[0].value).to.equals(agentDPS.unit(10));
    });
  });

  describe('locked', () => {
    it("should return account's locked funds", async () => {
      const now = Math.floor(Date.now() / 1000);
      await Security.lock(accounts[0].address, {
        value: agentDPS.unit(100),
        release: now - 3600,
      });
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

  describe('lockBatch', () => {
    it('it should revert if length of parameters are different', async () => {
      const lock1: LockStruct = { value: 1, release: 2 };

      await expect(Security.lockBatch([accounts[0].address, accounts[1].address], [lock1])).to.revertedWith(
        'LockingSecurity: lock batch size mismatch',
      );
    });

    it('it should execute batch locking', async () => {
      const lock1: LockStruct = { value: 1, release: 2 };
      const lock2: LockStruct = { value: 3, release: 4 };

      await Security.lockBatch([accounts[0].address, accounts[1].address], [lock1, lock2]);

      expect(await Security.locks(accounts[0].address)).to.deep.equals([
        [BigNumber.from(lock1.value), BigNumber.from(lock1.release)],
      ]);
      expect(await Security.locks(accounts[1].address)).to.deep.equals([
        [BigNumber.from(lock2.value), BigNumber.from(lock2.release)],
      ]);
    });
  });

  describe('vest', () => {
    it('should lock and transfer DPS to the investor', async () => {
      const now = Math.floor(Date.now() / 1000);
      await Security.grantRole(id('SALE'), Security.address);

      const amount = agentDPS.unit(20000);
      await DPS.increaseAllowance(Security.address, amount);

      await Security.vest(accounts[1].address, {
        value: amount,
        release: now + 3600,
      });
      expect(await Security.locked(accounts[1].address, now)).to.equals(amount);
      expect(await Security.available(accounts[1].address, now)).to.equals(0);
      expect(await DPS.balanceOf(accounts[1].address)).to.equals(amount);
    });
  });

  describe('vestBatch', () => {
    it('it should revert if length of parameters are different', async () => {
      const lock1: LockStruct = { value: 1, release: 2 };

      await expect(Security.vestBatch([accounts[0].address, accounts[1].address], [lock1])).to.revertedWith(
        'LockingSecurity: vest batch size mismatch',
      );
    });
    it('should lock and transfer DPS to the investor', async () => {
      await Security.grantRole(id('SALE'), Security.address);

      const lock1: LockStruct = { value: 1, release: 2 };
      const lock2: LockStruct = { value: 3, release: 4 };

      await DPS.increaseAllowance(Security.address, BigNumber.from(lock1.value).add(lock2.value));

      await Security.vestBatch([accounts[0].address, accounts[1].address], [lock1, lock2]);

      expect(await Security.locks(accounts[0].address)).to.deep.equals([
        [BigNumber.from(lock1.value), BigNumber.from(lock1.release)],
      ]);
      expect(await Security.locks(accounts[1].address)).to.deep.equals([
        [BigNumber.from(lock2.value), BigNumber.from(lock2.release)],
      ]);

      expect(await DPS.balanceOf(accounts[0].address)).to.equals(lock1.value);
      expect(await DPS.balanceOf(accounts[1].address)).to.equals(lock2.value);
    });
  });

  it('Locked funds should not be transferable', async () => {
    await Security.grantRole(id('SALE'), Security.address);
    await Security.upgradeBridge(accounts[1].address);
    await DPS.increaseAllowance(Security.address, agentDPS.unit(2000000));
    const { getCurrentTime, setTime } = time();

    const start = await getCurrentTime();

    await Security.vestBatch(
      [accounts[0].address, accounts[0].address],
      [
        {
          value: agentDPS.unit(100000),
          release: start + 10,
        },
        { value: agentDPS.unit(50000), release: start + 20 },
      ],
    );

    await setTime(start + 5);
    await agentDPS.expectBalanceOf(accounts[0], agentDPS.unit(150000));
    await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, agentDPS.unit(1))).to.revertedWith(
      'LockingSecurity: transfer amount exceeds available tokens',
    );

    await setTime(start + 10);
    await DPS.connect(accounts[0]).transfer(accounts[1].address, agentDPS.unit(100000));
    await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, agentDPS.unit(1))).to.revertedWith(
      'LockingSecurity: transfer amount exceeds available tokens',
    );
    await agentDPS.expectBalanceOf(accounts[0], agentDPS.unit(50000));
    await agentDPS.expectBalanceOf(accounts[1], agentDPS.unit(100000));

    await setTime(start + 20);
    await DPS.connect(accounts[0]).transfer(accounts[1].address, agentDPS.unit(50000));
    await agentDPS.expectBalanceOf(accounts[0], agentDPS.unit(0));
    await agentDPS.expectBalanceOf(accounts[1], agentDPS.unit(150000));
  });
});
