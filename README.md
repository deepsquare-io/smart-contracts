# DeepSquare blockchain

[![Codecov](https://img.shields.io/codecov/c/gh/deepsquare-io/blockchain?style=for-the-badge&token=7GE7USOW1S)](https://app.codecov.io/gh/deepsquare-io/blockchain)
[![Whitepaper](https://img.shields.io/static/v1?label=download&message=whitepaper&color=cd45FF&style=for-the-badge)](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf)

## Sale process

![Sale process diagram](https://mermaid.ink/img/pako:eNqtVE1v2zAM_SuETxuajzbrDvOh2JAWWzZgG5phw4BcZImJhciSK1EpgqL_vZTlfKzpDgNmGJYgPz6-R9J-KKRTWJRFwLuIVuK1FisvmoUFvlrhSUvdCkswAxFgZjcYyPnT13NhMCG6VTpLXkg6hX3jY4MvhKOMXtO2o9jtDzQ5wGi77hKU3XMUnAFn4aOmT7GC91ATtaEcj1ea6liNpGvGCrENd1F4HGo3royTa1kLbdO2Gjdpt8sSxjvS42y9lnK_-_9Zj4iT05zdoyTwq-rVZHI-gMnbCT_eXLzOL9M1G15dneVylnCbuhcItEJLqXQbYbQSpJ09RHx1hOA26GE22AV--T0FHYAVeI40W6iFVQYVVFv4HBvtYOp863xHNTpw5XiWMDxU6BcvGIBq7Gg9hmj6EUCrTo1dvEueLpO7y2fGcpM_GOPugVweKl65YjYs2UDNmgOJyqB0-i8WM8ePBOV7bd29TdO1KDpawbO-KEDbTu_N7XQ4OU-UVgmvRn-o_gfdZ71wImxaCklzFbdw_X1-wCVIB90XblqjXINespr8eXEXwq6F3IvOQt_ZI54-fth1QeQxoOhtbkEMXIXUB9LoX6pQDvnZZ8lBAY15pjSxz9L4W5UxezN8UgyKBj0PtOJfyEM6XhSMabi0JW8VLkWagWJhHxka25TpRmm2WJRLYQIOChHJzbdWFiX5iDtQ_xvqUY9PPoWHCQ)

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
