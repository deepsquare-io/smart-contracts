import assert from 'assert';
import chalk from 'chalk';
import { utils } from 'ethers';
import logger from '../logger';
import { DEFAULT_ADMIN_ROLE } from '../testing/AccessControl';
import AccessControl from '../types/openzeppelin/AccessControl';
import waitTx from './waitTx';

function parseRole(role: string) {
  const display = role === DEFAULT_ADMIN_ROLE ? 'DEFAULT_ADMIN_ROLE' : role;
  const keccak = role.startsWith('0x') ? role : utils.id(role);

  return { display, keccak };
}

export async function grantRole(contract: AccessControl, role: string, account: string) {
  const { display, keccak } = parseRole(role);

  if (await contract.hasRole(keccak, account)) {
    logger.info(chalk.magenta(account), 'has already role', chalk.cyan(display), 'in', chalk.magenta(contract.address));
    return;
  }

  await waitTx(contract.grantRole(keccak, account));
  assert(await contract.hasRole(keccak, account), `${account} has not ${display} role in ${contract.address}`);
  logger.info('Granted role', chalk.cyan(display), 'to', chalk.magenta(account), 'in', chalk.magenta(contract.address));
}

export async function revokeRole(contract: AccessControl, role: string, account: string) {
  const { display, keccak } = parseRole(role);

  if (!(await contract.hasRole(keccak, account))) {
    logger.warn(chalk.magenta(account), 'has not role', chalk.cyan(display), 'in', chalk.magenta(contract.address));
    return;
  }

  await waitTx(contract.revokeRole(keccak, account));
  assert(!(await contract.hasRole(keccak, account)), `${account} has still ${display} role in ${contract.address}`);
  logger.info('Revoked role', chalk.cyan(display), 'to', chalk.magenta(account), 'in', chalk.magenta(contract.address));
}
