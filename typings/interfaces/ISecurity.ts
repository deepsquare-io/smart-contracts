import { BigNumberish } from '@ethersproject/bignumber';
import { BaseContract } from '@ethersproject/contracts';

export default interface ISecurity extends BaseContract {
  /**
   * Check if the transfer triggered by `sender` of `amount` can occur from `from` to `to`.
   * @param sender The account which triggered the transfer.
   * @param from The account from where the tokens will be taken.
   * @param to The account where the tokens will be sent.
   * @param amount The token amount.
   */
  validateTokenTransfer(sender: string, from: string, to: string, amount: BigNumberish): Promise<void>;
}
