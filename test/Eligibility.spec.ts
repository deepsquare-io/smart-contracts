import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Eligibility', () => {
  let admin: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let eligibility: Contract;
  const WRITER_ROLE = ethers.utils.id('WRITER');

  beforeEach(async () => {
    [admin, ...accounts] = await ethers.getSigners();
    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();
  });

  it('should grant deployer the admin role', async () => {
    expect(await eligibility.hasRole(await eligibility.getRoleAdmin(WRITER_ROLE), admin.address)).to.be.true;
  });

  describe('addWriter', () => {
    it('should allow the admin to grant the WRITER role', async () => {
      await eligibility.addWriter(accounts[0].address);
      expect(await eligibility.hasRole(WRITER_ROLE, accounts[0].address)).to.be.true;
    });

    it('should revert if a non-admin tries to self-grant the WRITER role', async () => {
      await expect(eligibility.connect(accounts[0]).addWriter(accounts[0].address)).to.revertedWith(
        `AccessControl: account ${accounts[0].address.toLowerCase()} is missing role 0x0000000000000000000000000000000000000000000000000000000000000000`,
      );
    });
  });

  describe('removeWriter', () => {
    beforeEach(async () => {
      await eligibility.addWriter(accounts[0].address);
    });

    it('should allow the admin to revoke the WRITER role', async () => {
      await eligibility.removeWriter(accounts[0].address);
      expect(await eligibility.hasRole(WRITER_ROLE, accounts[0].address)).to.be.false;
    });

    it('should revert if a non-admin tries to revoke the WRITER role to someone else', async () => {
      await expect(eligibility.connect(accounts[1]).addWriter(accounts[0].address)).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role 0x0000000000000000000000000000000000000000000000000000000000000000`,
      );
    });
  });

  describe('setResult/result', () => {
    beforeEach(async () => {
      await eligibility.addWriter(accounts[0].address);
    });

    [1, 2].forEach((tier) => {
      it(`should allow a WRITER to write a KYC tier ${tier}`, async () => {
        const result = {
          tier,
          validator: 'Jumio Corporation',
          transactionId: randomBytes(16).toString('hex'),
        };

        await eligibility.connect(accounts[0]).setResult(accounts[1].address, result);
        const writtenR = await eligibility.connect(accounts[2]).result(accounts[1].address);

        for (const [key, value] of Object.entries(result)) {
          expect(writtenR[key]).to.equal(value);
        }
      });
    });

    it('should revert if the admin tries to write a KYC tier', async () => {
      await expect(
        eligibility.connect(admin).setResult(accounts[1].address, {
          tier: 1,
          validator: 'Jumio Corporation',
          transactionId: randomBytes(16).toString('hex'),
        }),
      ).to.revertedWith(
        `AccessControl: account ${admin.address.toLowerCase()} is missing role ${ethers.utils.id('WRITER')}`,
      );
    });
  });
});
