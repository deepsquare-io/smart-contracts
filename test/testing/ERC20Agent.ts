import { expect } from 'chai';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { parseUnits } from '@ethersproject/units';
import { IERC20Metadata } from '../../typings/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata';
import { Account, getAddress } from './Account';

export interface ERC20Agent {
  unit: (amount: BigNumberish, unit?: BigNumberish) => BigNumber;
  transfer: (account: Account, balance: BigNumberish, unit?: BigNumberish) => Promise<TransactionResponse>;
  expectBalanceOf: (account: Account, balance: BigNumberish, unit?: BigNumberish) => Promise<void>;
}

export async function createERC20Agent(contract: IERC20Metadata): Promise<ERC20Agent> {
  const decimals = await contract.decimals();

  const parseUnit = (amount: BigNumberish, unit?: BigNumberish) => {
    if (amount instanceof BigNumber) {
      return amount;
    }

    return parseUnits(amount.toString(), unit ?? decimals);
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
