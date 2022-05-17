import { ContractFactory } from 'ethers';
import { network, run } from 'hardhat';
import { NomicLabsHardhatPluginError } from 'hardhat/plugins';
import logger from './logger';

/**
 * Deploy a contract using the TypeChain factories and verify the source on the blockchain explorer if possible.
 * Ignore "Already Verified" errors.
 * @param factory The contract factory.
 * @param args The contract contractor arguments.
 * @return The deployed contract instance.
 */
export default async function deploy<F extends ContractFactory>(
  factory: F,
  args: Parameters<F['deploy']>,
): Promise<ReturnType<F['deploy']>> {
  const name = factory.constructor.name.replace('__factory', '');
  const contract = await factory.deploy(...args);
  await contract.deployed();

  logger.info(name, 'deployed at', contract.address);

  if (network.name !== 'hardhat') {
    // Wait 1s to avoid explorer to crash
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const consoleLog = console.log;

    try {
      console.log = () => void 0;

      logger.debug('Verifying', name, 'at', contract.address);
      await run('verify:verify', {
        address: contract.address,
        constructorArguments: args,
      });
      logger.debug('Verification of', name, 'at', contract.address, 'succeeded');
    } catch (e) {
      if (NomicLabsHardhatPluginError.isNomicLabsHardhatPluginError(e) && e.message.includes('Already Verified')) {
        logger.debug(name, 'at', contract.address, 'already verified');
      } else {
        logger.error(e);
      }
    } finally {
      console.log = consoleLog;
    }
  }

  return contract;
}
