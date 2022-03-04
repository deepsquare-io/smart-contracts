import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

function wDPS(amount: number) {
  return BigNumber.from(ethers.utils.parseUnits(amount.toString(10)));
}

describe('DeepSquareToken', () => {
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let DPS: Contract;

  async function expectBalance(account: string | SignerWithAddress, amount: number) {
    const address = typeof account === 'string' ? account : account.address;
    expect(await DPS.balanceOf(address)).to.equal(wDPS(amount));
  }

  beforeEach(async () => {
    [owner, ...accounts] = await ethers.getSigners();
    const DeepSquareTokenFactory = await ethers.getContractFactory('DeepSquareToken');
    DPS = await DeepSquareTokenFactory.deploy();
    await DPS.deployed();
  });

  it('should mint 210M DPS to the owner', async () => {
    expect(await DPS.balanceOf(owner.address)).to.equal('210000000000000000000000000');
  });

  describe('transfer', () => {
    it('should let owner transfer DPS to another account', async () => {
      const amount = wDPS(42);

      await DPS.transfer(accounts[0].address, amount);
      expect(await DPS.balanceOf(accounts[0].address)).to.equal(amount);
    });

    it('should revert if the account is not the owner', async () => {
      const initialOwnerBalance = await DPS.balanceOf(owner.address);
      const amount = BigNumber.from(ethers.utils.parseUnits('42000'));

      await expect(DPS.connect(accounts[0]).transfer(accounts[1].address, amount)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
      expect(await DPS.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe('transferFrom', () => {
    it('should allow the owner to move DPS tokens freely', async () => {
      await DPS.transfer(accounts[0].address, wDPS(42));
      await expectBalance(accounts[0], 42);

      await DPS.transferFrom(accounts[0].address, accounts[1].address, wDPS(12));
      await expectBalance(accounts[1], 12);
      await expectBalance(accounts[0], 30);
    });

    it('should revert if the account is not the owner', async () => {
      await DPS.transfer(accounts[0].address, wDPS(42));
      await expectBalance(accounts[0], 42);

      await expect(
        DPS.connect(accounts[0]).transferFrom(accounts[0].address, accounts[1].address, wDPS(12)),
      ).to.revertedWith('Ownable: caller is not the owner');
    });
  });
});
