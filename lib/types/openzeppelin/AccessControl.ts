import { BaseContract, providers } from 'ethers';

export default interface AccessControl extends BaseContract {
  hasRole(role: string, account: string): Promise<boolean>;

  grantRole(role: string, account: string): Promise<providers.TransactionResponse>;

  revokeRole(role: string, address: string): Promise<providers.TransactionResponse>;

  renounceRole(role: string, address: string): Promise<providers.TransactionResponse>;
}
