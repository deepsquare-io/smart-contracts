import { BaseContract } from 'ethers';
import { ethers, network, run } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { id } from '@ethersproject/hash';
import { parseUnits } from '@ethersproject/units';
import { ZERO_ADDRESS } from '../lib/constants';
import waitTx from '../lib/waitTx';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { Eligibility } from '../typings/contracts/Eligibility';
import { LockingSecurity } from '../typings/contracts/LockingSecurity';
import { Sale as SaleV3 } from '../typings/contracts/Sale';
import { BridgeToken } from '../typings/contracts/vendor/BridgeToken.sol/BridgeToken';

async function deploy<T extends BaseContract>(name: string, args: unknown[] = []): Promise<T> {
  const factory = await ethers.getContractFactory(name);
  console.debug(`Deploying ${name}`);

  const contract = (await factory.deploy(...args)) as unknown as T;
  await contract.deployed();

  console.debug(`${name} deployed to ${contract.address}`);

  try {
    await run('verify:verify', {
      address: contract.address,
      constructorArguments: args,
    });
  } catch (e) {
    console.error(e);
  }

  return contract;
}

const aggregator = {
  mainnet: '0x0A77230d17318075983913bC2145DB16C7366156',
  fuji: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
};

async function main() {
  if (!(network.name in aggregator)) {
    throw new Error(`Unsupported network ${network.name}`);
  }

  const [deployer] = await ethers.getSigners();

  const Aggregator = {
    address: aggregator[network.name as keyof typeof aggregator],
  };

  const USDC = await deploy<BridgeToken>('BridgeToken');
  const DPS = await deploy<DeepSquare>('DeepSquare', [ZERO_ADDRESS]);
  const Security = await deploy<LockingSecurity>('LockingSecurity', [DPS.address]);
  await waitTx(DPS.setSecurity(Security.address));
  const Eligibility = await deploy<Eligibility>('Eligibility');
  const Sale = await deploy<SaleV3>('Sale', [
    DPS.address,
    USDC.address,
    Eligibility.address,
    Aggregator.address,
    60,
    250e6,
    0,
  ]);

  // Configuration
  await waitTx(DPS.transfer(Sale.address, parseUnits('100000')));
  await waitTx(USDC.mint(deployer.address, BigNumber.from(100).mul(1e9).mul(1e6), ZERO_ADDRESS, 0, id('0000'))); // $100bn
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
