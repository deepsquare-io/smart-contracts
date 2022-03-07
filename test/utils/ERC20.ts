import { expect } from 'chai';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { Account, getAddress } from './Account';

export function createERC20Agent(contract: Contract) {
  const parseUnit = async (amount: BigNumberish, unit?: BigNumberish) => {
    if (amount instanceof BigNumber) {
      return amount;
    }

    const _unit = unit ?? (await contract.decimals());
    return ethers.utils.parseUnits(amount.toString(), _unit);
  };

  return {
    parseUnit,
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

export type ERC20Agent = ReturnType<typeof createERC20Agent>;
