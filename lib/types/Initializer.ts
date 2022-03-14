import { BaseContract, BigNumberish, providers } from 'ethers';
import { Result } from './Eligibility';

export default interface Initializer extends BaseContract {
  setResults(accounts: string[], batch: Result[]): Promise<providers.TransactionResponse>;
  airdrop(recipients: string[], amounts: BigNumberish[]): Promise<providers.TransactionResponse>;
  destruct(): Promise<providers.TransactionResponse>;
}
