import { expect } from 'chai';
import { ethers } from 'hardhat';
import { id } from '@ethersproject/hash';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Eligibility } from '../typings/contracts/legacy/v1.2/Eligibility';
import { Eligibility__factory } from '../typings/factories/contracts/Eligibility__factory';
import { DEFAULT_ADMIN_ROLE, MissingRoleError } from './testing/AccessControl';
import { randomResult } from './testing/random';

describe('Eligibility', () => {
  let admin: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let eligibility: Eligibility;

  const WRITER_ROLE = id('WRITER');

  beforeEach(async () => {
    [admin, ...accounts] = await ethers.getSigners();
    eligibility = await new Eligibility__factory(admin).deploy();
  });

  describe('constructor', () => {
    it('should grant deployer the DEFAULT_ADMIN_ROLE and WRITER role', async () => {
      expect(await eligibility.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await eligibility.hasRole(WRITER_ROLE, admin.address)).to.be.true;
    });
  });

  describe('setResult', () => {
    beforeEach(async () => {
      await eligibility.grantRole(WRITER_ROLE, accounts[0].address);
    });

    it('should revert if a non-WRITER tries to set a result', async () => {
      await expect(eligibility.connect(accounts[3]).setResult(accounts[0].address, randomResult())).to.be.revertedWith(
        MissingRoleError(accounts[3], 'WRITER'),
      );
    });

    [1, 2].forEach((tier) => {
      it(`should allow a WRITER to write a KYC tier ${tier}`, async () => {
        const result = randomResult(tier);

        await expect(eligibility.connect(accounts[0]).setResult(accounts[1].address, result))
          .to.emit(eligibility, 'Validation')
          .withArgs(accounts[1].address, [...Object.values(result)]);
        const writtenR = await eligibility.connect(accounts[2]).results(accounts[1].address);

        expect(result.tier).to.equals(writtenR.tier);
        expect(result.validator).to.equals(writtenR.validator);
        expect(result.transactionId).to.equals(writtenR.transactionId);
      });
    });
  });
});
