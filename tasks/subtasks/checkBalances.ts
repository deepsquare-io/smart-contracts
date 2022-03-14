import assert, { AssertionError } from 'assert';
import { Presets, SingleBar } from 'cli-progress';
import { BigNumber } from 'ethers';
import logger from '../../lib/logger';
import DeepSquare from '../../lib/types/DeepSquare';
import e from '../../lib/utils/e';
import { legacyDPS } from './ethereum';

/**
 * @type {string[]} Some DeepSquare investors has changed/merged their wallets, and we have manually checked them.
 */
const MANUALLY_VERIFIED_ACCOUNTS = [
  '0xa5c71DAB0214b85D842F81343C42A675224941B9',
  '0x07Ad0DE1fCB57A4D94AFB759C3025FF8863cC077',
];

/**
 * We will now check all the balances of the accounts involved in the migration by retrieving their balance on the
 * Ethereum blockchain and comparing them with the deployed contracts
 */
export default async function checkBalances(DPS: DeepSquare, accounts: string[]) {
  logger.info('Checking DPS balances explicitly');
  const accountsSet = new Set<string>([...accounts]);

  for (const account of MANUALLY_VERIFIED_ACCOUNTS) {
    accountsSet.delete(account);
  }

  const progressC = new SingleBar({}, Presets.shades_classic);
  progressC.start(accountsSet.size, 0);
  const mismatch: { account: string; expected: BigNumber; actual: BigNumber }[] = [];

  for (const account of accountsSet) {
    const [expected, actual] = await Promise.all([
      legacyDPS.balanceOf(account).then((balance) => balance.mul(e(12))),
      DPS.balanceOf(account),
    ]);

    try {
      assert.equal(actual.toString(), expected.toString(), `Account ${account} balance mismatch`);
    } catch (e) {
      if (e instanceof AssertionError) {
        mismatch.push({ account, expected, actual });
      } else {
        throw e;
      }
    }

    progressC.increment();
  }
  progressC.stop();

  for (const { account, expected, actual } of mismatch) {
    logger.error(
      `Account ${account} balance mismatch: expected ${expected.div(e(18)).toString()} but got ${actual
        .div(e(18))
        .toString()}`,
    );
  }
}
