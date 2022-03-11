import { ethers } from 'hardhat';
import { Account, getAddress } from './Account';

export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

export function MissingRoleError(account: Account, role: string) {
  return `AccessControl: account ${getAddress(account)} is missing role ${ethers.utils.id(role)}`;
}
