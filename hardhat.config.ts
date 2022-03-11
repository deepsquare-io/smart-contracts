import 'dotenv/config';
import 'hardhat-gas-reporter';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
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
      chainId: 31337,
      forking: {
        url: 'https://api.avax-test.network/ext/bc/C/rpc',
      },
    },
  },
  gasReporter: {
    enabled: true,
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
};

if (process.env.FUJI_PRIVATE_KEY) {
  // Add the Avalanche Fuji network if there is a FUJI private key
  config.networks = {
    ...config.networks,
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.FUJI_PRIVATE_KEY],
    },
  };
}

// noinspection JSUnusedGlobalSymbols
export default config;
