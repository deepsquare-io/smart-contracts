import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { config } from 'hardhat';
import { join } from 'path';
import { ResultStruct, ValidationEvent } from '../../typings/contracts/Eligibility';
import { Eligibility__factory } from '../../typings/factories/contracts/Eligibility__factory';
import { ELIGIBILITY_ADDRESS } from '../constants';
import explore from '../explore';
import logger from '../logger';
import { mainnet } from '../provider';

/**
 * Get the current KYC validations.
 * @param refresh Do not use the cache, get fresh data from the blockchain (take approx. 3 minutes).
 * @return {Promise<Map<string, ResultStruct>>}
 */
export default async function fetchValidations(refresh = false) {
  const cacheFile = join(config.paths.cache, 'validations.json');
  const displayFile = cacheFile.replace(process.cwd(), '');

  if (!refresh && existsSync(cacheFile)) {
    logger.info('Using cached validations:', displayFile);

    return new Map<string, ResultStruct>(JSON.parse(await readFile(cacheFile, { encoding: 'utf-8' })));
  }

  const Eligibility = Eligibility__factory.connect(ELIGIBILITY_ADDRESS, mainnet);
  const validations = new Map<string, ResultStruct>();

  await explore(Eligibility, Eligibility.filters.Validation(), (event: ValidationEvent) => {
    validations.set(event.args['account'], {
      tier: event.args['result'].tier,
      validator: event.args['result'].validator,
      transactionId: event.args['result'].transactionId,
    });
  });

  await writeFile(cacheFile, JSON.stringify([...validations.entries()], null, 2));
  logger.info('Wrote validations:', displayFile);

  return validations;
}
