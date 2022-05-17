import { Presets, SingleBar } from 'cli-progress';
import { BaseContract } from 'ethers';
import { EventFilter } from '@ethersproject/contracts/src.ts';
import { TypedEvent } from '../typings/common';
import { STARTING_BLOCK } from './constants';
import logger from './logger';
import { mainnet } from './provider';

/**
 * Loop through the events of a contract, incrementing the loop by 2048 blocks at each round.
 * @param contract The contract to use.
 * @param filter The contract event filter.
 * @param cb The callback to execute on each matched event.
 * @param options The loop options (increment size and starting block)
 * @return {Promise<void>}
 */
export default async function explore<T extends BaseContract>(
  contract: T,
  filter: EventFilter,
  cb: (event: TypedEvent) => void,
  options = { increment: 2048, start: STARTING_BLOCK },
) {
  const start = options.start;
  const end = await mainnet.getBlockNumber();
  let i = start;

  logger.info('Retrieving DPS holders');

  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(end - start, 0);

  while (i < end) {
    const to = i + options.increment > end ? end : i + options.increment;
    const events = (await contract.queryFilter(filter, i, to)) as TypedEvent[];

    for (const event of events) {
      cb(event);
    }

    i = to;
    progress.update(i - start);
  }

  progress.stop();
}
