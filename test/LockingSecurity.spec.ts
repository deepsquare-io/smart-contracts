import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
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
});
