import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SpenderSecurity } from '../typings/contracts/SpenderSecurity';
import { SpenderSecurity__factory } from '../typings/factories/contracts/SpenderSecurity__factory';
import { MissingRoleError } from './testing/AccessControl';

describe('SpenderSecurity', () => {
  let deployer: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let security: SpenderSecurity;

  beforeEach(async () => {
    [deployer, ...accounts] = await ethers.getSigners();
    security = await new SpenderSecurity__factory(deployer).deploy();
  });

  describe('validateTokenTransfer', () => {
    it('should allow spender to move his tokens', async () => {
      await expect(
        security.validateTokenTransfer(deployer.address, deployer.address, accounts[1].address, parseUnits('1')),
      ).to.not.be.reverted;
    });

    it('should prevent spender to move tokens from another account', async () => {
      await expect(
        security.validateTokenTransfer(deployer.address, accounts[0].address, accounts[1].address, parseUnits('1')),
      ).to.be.revertedWith('SpenderSecurity: cannot move tokens from another account');
    });

    it('should prevent non-spender to move tokens', async () => {
      await expect(
        security.validateTokenTransfer(accounts[0].address, accounts[0].address, accounts[1].address, parseUnits('1')),
      ).to.be.revertedWith(MissingRoleError(accounts[0], 'SPENDER'));
    });
  });
});
