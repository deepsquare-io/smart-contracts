import type { BaseContract } from '@ethersproject/contracts';
import type { TransactionResponse } from '@ethersproject/providers';

export default interface Ownable extends BaseContract {
  owner(): Promise<string>;

  renounceOwnership(): Promise<TransactionResponse>;

  transferOwnership(newOwner: string): Promise<TransactionResponse>;
}
