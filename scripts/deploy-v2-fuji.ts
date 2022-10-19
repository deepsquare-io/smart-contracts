import { BaseContract } from 'ethers';
import { ethers, network, run } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { id } from '@ethersproject/hash';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ZERO_ADDRESS } from '../lib/constants';
import waitTx from '../lib/waitTx';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { Eligibility } from '../typings/contracts/Eligibility';
import { Sale as SaleV2 } from '../typings/contracts/Sale';
import { SpenderSecurity } from '../typings/contracts/SpenderSecurity';
import { BridgeToken } from '../typings/contracts/vendor/BridgeToken.sol/BridgeToken';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Sale__factory as SaleV1__factory } from '../typings/factories/contracts/legacy/v1/Sale__factory';

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

async function main() {
  if (!(network.name in aggregator)) {
    throw new Error(`Unsupported network ${network.name}`);
  }

  const mainDPS = new DeepSquare__factory()
    .connect(mainnet.getSigner())
    .attach('0xf192caE2e7Cd4048Bea307368015E3647c49338e');
  const mainSale = new SaleV1__factory()
    .connect(mainnet.getSigner())
    .attach('0xb4A981d2663455aEE53193Da8e7c61c3579301cb');

  const [deployer] = await ethers.getSigners();

  const Aggregator = {
    address: aggregator[network.name as keyof typeof aggregator],
  };

  const USDCe = await deploy<BridgeToken>('BridgeToken');
  const Security = await deploy<SpenderSecurity>('SpenderSecurity');
  const DPS = await deploy<DeepSquare>('DeepSquare', [Security.address]);
  const Eligibility = await deploy<Eligibility>('Eligibility');
  const Sale = await deploy<SaleV2>('Sale', [
    DPS.address,
    USDCe.address,
    Eligibility.address,
    Aggregator.address,
    40,
    250e6,
    0, // await mainSale.sold()
  ]);

  // Configuration
  await waitTx(DPS.transfer(Sale.address, await mainDPS.balanceOf(mainSale.address)));
  await waitTx(USDCe.mint(deployer.address, BigNumber.from(100).mul(1e9).mul(1e6), ZERO_ADDRESS, 0, id('0000'))); // $100bn
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
