import { expect } from 'chai';
import { randomBytes } from 'crypto';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MissingRoleError } from './utils/AccessControl';

function makeResult(tier: 0 | 1 | 2 | 3 = 1) {
  return {
    tier,
    validator: 'Jumio Corporation',
    transactionId: randomBytes(16).toString('hex'),
  };
}

describe('Eligibility', () => {
  let admin: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let eligibility: Contract;

  const OWNER_ROLE = ethers.utils.id('OWNER');
  const WRITER_ROLE = ethers.utils.id('WRITER');

  beforeEach(async () => {
    [admin, ...accounts] = await ethers.getSigners();
    const EligibilityFactory = await ethers.getContractFactory('Eligibility');
    eligibility = await EligibilityFactory.deploy();
  });

  it('should grant deployer the OWNER and the WRITER roles', async () => {
    expect(await eligibility.hasRole(OWNER_ROLE, admin.address)).to.be.true;
    expect(await eligibility.hasRole(WRITER_ROLE, admin.address)).to.be.true;
  });

  describe('setResult', () => {
    beforeEach(async () => {
      await eligibility.grantRole(WRITER_ROLE, accounts[0].address);
    });

    it('should revert if a non-WRITER tries to set a result', async () => {
      await expect(eligibility.connect(accounts[3]).setResult(accounts[0].address, makeResult())).to.be.revertedWith(
        MissingRoleError(accounts[3], 'WRITER'),
      );
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
  });
});
