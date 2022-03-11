import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MissingRoleError } from '../lib/testing/AccessControl';

describe('SpenderSecurity', () => {
  let deployer: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let security: Contract;

  beforeEach(async () => {
    [deployer, ...accounts] = await ethers.getSigners();

    const SpenderSecurityFactory = await ethers.getContractFactory('SpenderSecurity');
    security = await SpenderSecurityFactory.deploy();
  });

  describe('validateTokenTransfer', () => {
    it('should allow spender to move his tokens', async () => {
      await expect(
        security.validateTokenTransfer(
          deployer.address,
          deployer.address,
          accounts[1].address,
          ethers.utils.parseUnits('1'),
        ),
      ).to.not.be.reverted;
    });

    it('should prevent spender to move tokens from another account', async () => {
      await expect(
        security.validateTokenTransfer(
          deployer.address,
          accounts[0].address,
          accounts[1].address,
          ethers.utils.parseUnits('1'),
        ),
      ).to.be.revertedWith('SpenderSecurity: cannot move tokens from another account');
    });

    it('should prevent non-spender to move tokens', async () => {
      await expect(
        security.validateTokenTransfer(
          accounts[0].address,
          accounts[0].address,
          accounts[1].address,
          ethers.utils.parseUnits('1'),
        ),
      ).to.be.revertedWith(MissingRoleError(accounts[0], 'SPENDER'));
    });
  });
});
