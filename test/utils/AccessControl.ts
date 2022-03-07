import { ethers } from 'hardhat';
import { Account, getAddress } from './Account';

export function MissingRoleError(account: Account, role: string) {
  return `AccessControl: account ${getAddress(account)} is missing role ${ethers.utils.id(role)}`;
}
