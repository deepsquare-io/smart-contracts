import { expect } from 'chai';
import { describe } from 'mocha';
import { id } from '@ethersproject/hash';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../lib/constants';
import { ReferralProgram, ReferralProgram__factory, SpenderSecurity } from '../typings';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { ERC20Agent } from './testing/ERC20Agent';
import setup from './testing/setup';

describe('ReferralProgram', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: DeepSquare;
  let ReferralProgram: ReferralProgram;
  let Security: SpenderSecurity;
  let agentDPS: ERC20Agent;

  const INITIAL_ROUND = parseUnits('7000000', 18); // 7M DPS
  const LIMIT = parseUnits('2500', 18); // 25,000 DPS

  beforeEach(async () => {
    ({ owner, accounts, Security, DPS, agentDPS } = await setup());

    ReferralProgram = await new ReferralProgram__factory(owner).deploy(DPS.address, LIMIT);
    await Security.grantRole(id('SPENDER'), ReferralProgram.address);

    // Initial funding of the sale contract
    await DPS.transfer(ReferralProgram.address, INITIAL_ROUND);
  });

  describe('constructor', () => {
    it('should revert if the DPS contract is the zero address', async () => {
      await expect(new ReferralProgram__factory(owner).deploy(ZERO_ADDRESS, LIMIT)).to.be.revertedWith(
        'ReferralProgram: token is zero.',
      );
    });
    it('should revert id the limit is <= 0', async () => {
      await expect(new ReferralProgram__factory(owner).deploy(DPS.address, 0)).to.be.revertedWith(
        'ReferralProgram: Limit is lower or equal to zero.',
      );
    });
  });

  describe('deliver', () => {
    it("should revert if referrer's balance < limit", async () => {
      const balance = await DPS.balanceOf(accounts[0].address);
      await DPS.connect(accounts[0]).approve(owner.address, balance);
      await DPS.transferFrom(accounts[0].address, accounts[1].address, balance);
      expect(ReferralProgram.deliver([accounts[0].address], [[accounts[1].address]])).to.be.revertedWith(
        'ReferralProgram: referrer balance is lower than limit',
      );
    });
    it('should revert if referrers and referees lists have differents lengths', async () => {
      expect(
        ReferralProgram.deliver([accounts[0].address, accounts[2].address], [[accounts[1].address]]),
      ).to.be.revertedWith('ReferralProgram: referrers and referees lists have different lengths.');
    });
    it('should deliver referral gains', async () => {
      await agentDPS.transfer(accounts[2], 10000, 18);
      await agentDPS.transfer(accounts[3], 10000, 18);
      await agentDPS.transfer(accounts[4], 20000, 18);
      await agentDPS.transfer(accounts[5], 20000, 18);
      await agentDPS.transfer(accounts[6], 30000, 18);
      await ReferralProgram.deliver(
        [accounts[2].address, accounts[4].address],
        [[accounts[3].address], [accounts[5].address, accounts[6].address]],
      );
      await agentDPS.expectBalanceOf(accounts[2], 11200);
      await agentDPS.expectBalanceOf(accounts[4], 26000);
    });
  });
});
