import 'dotenv/config';
import 'hardhat-gas-reporter';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import './tasks/typechain';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.13',
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        // url: 'https://api.avax.network/ext/bc/C/rpc',
        url: 'https://api.avax-test.network/ext/bc/C/rpc',
      },
      gas: 8000000,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: process.env.FUJI_PRIVATE_KEY ? [process.env.FUJI_PRIVATE_KEY, '5fedc670267dca2a3891f57b225c3198c5086b3e68b348702b10cae0e37f55c3', 'e15d2ed7dd7e562744fe1b73ff2bfbc29dd5053246133ce45786aaf43a7819a6', 'e6d28a64e9238b974642fec3b55d3d8ff21798ffb4f4018aa35524eeb2e8529c'] : [],
    },
    mainnet: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: 'USD',
    excludeContracts: ['vendor/'],
    token: 'AVAX',
    gasPriceApi: 'https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.COINTMARKETCAP_KEY,
  },
  etherscan: {
    apiKey: {
      avalanche: process.env.SNOWTRACE_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
    },
  },
  typechain: {
    outDir: 'typings',
    target: 'ethers-v5',
  },
};

// noinspection JSUnusedGlobalSymbols
export default config;
