import type { BaseContract } from '@ethersproject/contracts';
import type { TransactionResponse } from '@ethersproject/providers';
import IEligibility from './interfaces/IEligibility';
import type AccessControl from './openzeppelin/AccessControl';

export interface Result {
  tier: number;
  validator: string;
  transactionId: string;
}

export default interface Eligibility extends IEligibility, AccessControl, BaseContract {
  results(account: string): Promise<Result>;
  setResult(account: string, result: Result): Promise<TransactionResponse>;
  setBatchResults(accounts: string[], batch: Result[]): Promise<TransactionResponse>;
}
