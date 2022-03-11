import { utils } from 'ethers';
import { DEFAULT_ADMIN_ROLE } from '../testing/AccessControl';
import AccessControl from '../types/openzeppelin/AccessControl';
import waitTx from './waitTx';

export default async function grantRole(contract: AccessControl, role: string, account: string) {
  const displayRole = role === DEFAULT_ADMIN_ROLE ? 'DEFAULT_ADMIN_ROLE' : role;
  const keccakRole = role.startsWith('0x') ? role : utils.id(role);

  if (await contract.hasRole(keccakRole, account)) {
    console.info(account, 'has already role', role, 'in', contract.address);
    return;
  }

  await waitTx(contract.grantRole(keccakRole, account));
  console.log('Granted role', displayRole, 'to', account, 'in', contract.address);
}
