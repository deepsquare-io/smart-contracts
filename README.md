# DeepSquare blockchain

[![Codecov](https://img.shields.io/codecov/c/gh/deepsquare-io/blockchain?style=for-the-badge&token=7GE7USOW1S)](https://app.codecov.io/gh/deepsquare-io/blockchain)
[![Whitepaper](https://img.shields.io/static/v1?label=download&message=whitepaper&color=cd45FF&style=for-the-badge)](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf)

## Sale process

```mermaid
sequenceDiagram
    participant I as Investor
    participant Sale as Sale contract
    participant Oracle
    participant Security as Security contract

    link Sale: Sale.sol on GitHub @ https://github.com/deepsquare-io/blockchain/blob/main/contracts/Sale.sol
    link Security: Security.sol on GitHub @ https://github.com/deepsquare-io/blockchain/blob/main/contracts/Security.sol


    rect rgb(220, 252, 231)
        I->>+Oracle: Request identity validation
        Note over I,Oracle: KYC is currently handled by Jumio Corporation.
        Oracle->>-Security: Writes the KYC result
    end

    rect rgb(219, 234, 254)
        I->>Sale: Allow to Sale to transfer his stablecoin
        Note over I,Sale: This is known as "Allowance" in the ERC-20 standard.
    end


    rect rgb(219, 234, 254)
        I->>+Sale: Attempts to buy DPS
        Sale->>+Security: Check if investor has validated his identity
        Security-->>-Sale: Returns the user KYC tier
        Note over Sale: Validates the sell
        Sale-->>-I: Sends the DPS
    end
```

# Overview

This project implements the contract of the Square token (DPS) on the Avalanche network.

The contract can be launched on several networks :

- Hardhat local network (also used for contract unit tests)
- Avalanche local network (see below)
- Avalanche Testnet (FUJI)
- Avalanche Mainnet

# Installation

```node
npm install
```

# Launch a contract on the avalanche local network

In order to use the avalanche local network, you need to follow [those instructions](https://docs.avax.network/build/tutorials/platform/create-a-local-test-network/)

You can then run

```node
npm run start:avalanche
```

# Useful commands

Deploy a script

```node
npx hardhat run scripts/deploy.js
```

Open the console, instead of writing scripts

```node
npx hardhat console
```

Verify a contract on snowtrace testnet

```node
npx hardhat verify --network fuji CONTRACT_ADDRESS
```

# Other commands from hardhat

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```
