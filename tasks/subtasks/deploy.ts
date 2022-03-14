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
  'Deploy an individual contract and verify it at the same time',
  async ({ name, args = [] }, { ethers }) => {
    const factory: ContractFactory = await ethers.getContractFactory(name);
    const contract = await factory.deploy(...args);
    await contract.deployed();
    logger.info(name, 'deployed to', chalk.magenta(contract.address));

    return contract;
  },
);
