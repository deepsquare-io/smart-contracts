import type { BaseContract } from '@ethersproject/contracts';
import type { TransactionResponse } from '@ethersproject/providers';

export default interface AccessControl extends BaseContract {
  hasRole(role: string, account: string): Promise<boolean>;

  grantRole(role: string, account: string): Promise<TransactionResponse>;

  revokeRole(role: string, address: string): Promise<TransactionResponse>;

  renounceRole(role: string, address: string): Promise<TransactionResponse>;
}
