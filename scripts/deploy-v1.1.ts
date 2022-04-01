import { artifacts, ethers, network, run } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { BaseContract, Contract } from '@ethersproject/contracts';
import { id } from '@ethersproject/hash';
import { StaticJsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { ZERO_ADDRESS } from '../lib/constants';
import DeepSquare from '../typings/DeepSquare';
import Eligibility from '../typings/Eligibility';
import Sale from '../typings/Sale';

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

const mainnet = new StaticJsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');

async function waitTx(tx: Promise<TransactionResponse>) {
  const response = await tx;
  return await response.wait();
}

async function main() {
  if (!(network.name in aggregator)) {
    throw new Error(`Unsupported network ${network.name}`);
  }

  const mainDPS = new BaseContract(
    '0xf192caE2e7Cd4048Bea307368015E3647c49338e',
    (await artifacts.readArtifact('DeepSquare')).abi,
    mainnet,
  ) as DeepSquare;
  const mainSale = new BaseContract(
    '0xb4A981d2663455aEE53193Da8e7c61c3579301cb',
    (await artifacts.readArtifact('Sale')).abi,
    mainnet,
  ) as Sale;

  const [deployer] = await ethers.getSigners();

  const Aggregator = {
    address: aggregator[network.name as keyof typeof aggregator],
  };

  const USDCe = await deploy<Contract>('BridgeToken');
  const Security = await deploy<DeepSquare>('SpenderSecurity');
  const DPS = await deploy<DeepSquare>('DeepSquare', [Security.address]);
  const Eligibility = await deploy<Eligibility>('Eligibility');
  const Sale = await deploy<Sale>('Sale', [
    DPS.address,
    USDCe.address,
    Eligibility.address,
    Aggregator.address,
    40,
    250e6,
    await mainSale.sold(),
  ]);

  // Configuration
  await waitTx(DPS.transfer(Sale.address, await mainDPS.balanceOf(mainSale.address)));
  await waitTx(USDCe.mint(deployer.address, BigNumber.from(100).mul(1e9).mul(1e6), ZERO_ADDRESS, 0, id('0000'))); // $100bn
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
