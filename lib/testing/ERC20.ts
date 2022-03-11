import { expect } from 'chai';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { Account, getAddress } from './Account';

export interface ERC20Agent {
  unit: (amount: BigNumberish, unit?: BigNumberish) => BigNumber;
  transfer: (account: Account, balance: BigNumberish, unit?: BigNumberish) => Promise<any>;
  expectBalanceOf: (account: Account, balance: BigNumberish, unit?: BigNumberish) => Promise<any>;
}

export async function createERC20Agent(contract: Contract): Promise<ERC20Agent> {
  const decimals = await contract.decimals();

  const parseUnit = (amount: BigNumberish, unit?: BigNumberish) => {
    if (amount instanceof BigNumber) {
      return amount;
    }

    return ethers.utils.parseUnits(amount.toString(), unit ?? decimals);
  };

  return {
    unit: parseUnit,
    transfer: async (account: Account, balance: BigNumberish, unit?: BigNumberish) => {
      const address = getAddress(account);
      return contract.transfer(address, await parseUnit(balance, unit));
    },
    expectBalanceOf: async (account: Account, balance: BigNumberish, unit?: BigNumberish) => {
      const address = getAddress(account);
      const _balance = await parseUnit(balance, unit);
      expect(await contract.balanceOf(address)).to.equals(_balance);
    },
  };
}
