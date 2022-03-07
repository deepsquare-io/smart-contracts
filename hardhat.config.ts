import 'dotenv/config';
import 'hardhat-gas-reporter';
import { task } from 'hardhat/config';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * This is a hardhat task to print the list of accounts on the local
 * avalanche chain as well as their balances
 *
 * Prints out an array of strings containing the address Hex and balance in Wei
 */
task('balances', 'Prints the list of AVAX account balances', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account.address);
    console.log(`${account.address} has balance ${balance.toString()}`);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.9' }],
  },
  networks: {
    local: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.FUJI_PRIVATE_KEY],
      gasPrice: 500000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      avalanche: process.env.SNOWTRACE_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY, // create account on snowtrace.io to get api key
    },
  },
};
