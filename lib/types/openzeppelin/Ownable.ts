import { BaseContract, providers } from 'ethers';

export default interface Ownable extends BaseContract {
  owner(): Promise<string>;

  renounceOwnership(): Promise<providers.TransactionResponse>;

  transferOwnership(newOwner: string): Promise<providers.TransactionResponse>;
}
