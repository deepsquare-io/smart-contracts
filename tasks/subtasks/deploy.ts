import chalk from 'chalk';
import { ContractFactory } from 'ethers';
import { subtask } from 'hardhat/config';
import logger from '../../lib/logger';

interface DeployContractArgs {
  name: string;
  args: unknown[];
  verify: boolean;
}

subtask<DeployContractArgs>(
  'deploy:contract',
  'Deploy an individual contract',
  async ({ name, args = [], verify = false }, { network, run, ethers }) => {
    const factory: ContractFactory = await ethers.getContractFactory(name);
    const contract = await factory.deploy(...args);
    await contract.deployed();
    logger.info(name, 'deployed to', chalk.magenta(contract.address));

    if (!verify) {
      return contract;
    }

    if (network.name === 'hardhat') {
      logger.info('Skipping verification on local Hardhat network');
      return contract;
    }

    try {
      await run('verify:verify', {
        address: contract.address,
        constructorArguments: args,
        contract: name,
      });
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        (err as { message: string }).message.includes('Already Verified')
      ) {
        logger.warn(name, 'is already verified, skipping');
      } else {
        throw err;
      }
    }

    return contract;
  },
);
