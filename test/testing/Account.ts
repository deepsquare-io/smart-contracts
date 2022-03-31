import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export type Account = SignerWithAddress | string;

export function getAddress(account: Account): string {
  return (typeof account === 'string' ? account : account.address).toLowerCase();
}
