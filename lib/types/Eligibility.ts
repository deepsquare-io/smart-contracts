import { providers, BaseContract } from 'ethers';
import AccessControl from './openzeppelin/AccessControl';

export interface Result {
  tier: number;
  validator: string;
  transactionId: string;
}

export default interface Eligibility extends BaseContract, AccessControl {
  results(account: string): Promise<Result>;
  setResult(account: string, result: Result): Promise<providers.TransactionResponse>;
}
