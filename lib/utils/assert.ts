import assert from 'assert';
import chalk from 'chalk';
import logger from '../logger';

const OK = chalk.bgGreenBright(chalk.whiteBright(' OK '));

export function equal(a: unknown, b: unknown, valid: string, invalid: string | Error) {
  assert.equal(a, b, invalid);
  logger.info(OK, valid);
}

export function ok(value: unknown, valid: string, invalid: string | Error) {
  assert.ok(value, invalid);
  logger.info(OK, valid);
}
