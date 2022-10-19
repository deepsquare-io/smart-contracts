import { Presets, SingleBar } from 'cli-progress';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { config } from 'hardhat';
import { join } from 'path';
import { BigNumber } from '@ethersproject/bignumber';
import { TransferEvent } from '../../typings/contracts/DeepSquare';
import { DeepSquare__factory } from '../../typings/factories/contracts/DeepSquare__factory';
import { DEEPSQUARE_ADDRESS } from '../constants';
import explore from '../explore';
import logger from '../logger';
import { mainnet } from '../provider';

/**
 * Get the balances of the current DPS holders.
 * @param refresh Do not use the cache, get fresh data from the blockchain (take approx. 3 minutes).
 * @returns {Promise<Map<string, BigNumber>>}
 */
export default async function fetchBalances(refresh = false): Promise<Map<string, BigNumber>> {
  const cacheFile = join(config.paths.cache, 'balances.json');
  const displayFile = cacheFile.replace(process.cwd(), '');

  if (!refresh && existsSync(cacheFile)) {
    logger.info('Using cached balances:', displayFile);
    const raw: Record<string, string> = JSON.parse(await readFile(cacheFile, { encoding: 'utf-8' }));
    const map = new Map<string, BigNumber>();

    for (const [h, rawB] of Object.entries(raw)) {
      map.set(h, BigNumber.from(rawB));
    }

    return map;
  }

  const DeepSquare = DeepSquare__factory.connect(DEEPSQUARE_ADDRESS, mainnet);
  const holders = new Set<string>();
  const balances = new Map<string, BigNumber>();

  await explore(DeepSquare, DeepSquare.filters.Transfer(), (event: TransferEvent) => {
    holders.add(event.args['to']);
  });

  logger.info('Fetching DPS balances');

  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(holders.size, 0);

  const fetch = [...holders].map(async (h) => {
    const balance = await DeepSquare.balanceOf(h);

    if (!balance.isZero()) {
      balances.set(h, balance);
    }

    progress.increment();
  });

  await Promise.all(fetch);
  progress.stop();

  const dict: Record<string, string> = {};

  for (const [h, b] of balances.entries()) {
    dict[h] = b.toString();
  }

  await writeFile(cacheFile, JSON.stringify(dict, null, 2));
  logger.info('Wrote balances:', displayFile);

  return balances;
}
