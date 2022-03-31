import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BaseContract } from '@ethersproject/contracts';
import type { TransactionResponse } from '@ethersproject/providers';

/**
 * @see @openzeppelin/contracts/token/ERC20/IERC20.sol
 */
export default interface IERC20 extends BaseContract {
  totalSupply(): Promise<BigNumber>;

  balanceOf(account: string): Promise<BigNumber>;

  transfer(to: string, amount: BigNumberish): Promise<TransactionResponse>;

  allowance(owner: string, spender: string): Promise<BigNumber>;

  approve(spender: string, amount: BigNumberish): Promise<BigNumber>;

  transferFrom(from: string, to: string, amount: BigNumberish): Promise<TransactionResponse>;
}
