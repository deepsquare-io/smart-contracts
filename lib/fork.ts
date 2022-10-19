import { Presets, SingleBar } from 'cli-progress';
import { BigNumber } from 'ethers';
import { ethers, network } from 'hardhat';
import chunk from 'lodash/chunk';
import { id } from '@ethersproject/hash';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Eligibility__factory } from '../typings/factories/contracts/Eligibility__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';
import { Initializer__factory } from '../typings/factories/contracts/legacy/v1.0/Initializer__factory';
import { SpenderSecurity__factory } from '../typings/factories/contracts/legacy/v1.1/SpenderSecurity__factory';
import { BridgeToken__factory } from '../typings/factories/contracts/vendor/BridgeToken.sol/BridgeToken__factory';
import {
  DPS_TOTAL_SUPPLY,
  ELIGIBILITY_WRITER_ADDRESS,
  GNOSIS_ADDRESS,
  PRIVATE_SALE2_ADDRESS,
  ZERO_ADDRESS,
} from './constants';
import deploy from './deploy';
import fetchBalances from './fetch/fetchBalances';
import fetchValidations from './fetch/fetchValidations';
import { mainnet } from './provider';
import waitTx from './waitTx';

export default async function fork() {
  const [deployer] = await ethers.getSigners();

  if (network.name === 'mainnet') {
    throw new Error('Cannot fork on mainnet');
  }

  const eligibility = await deploy(new Eligibility__factory(deployer), []);
  const spender = await deploy(new SpenderSecurity__factory(deployer), []);
  const DeepSquare = await deploy(new DeepSquare__factory(deployer), [spender.address]);
  const USDC = await deploy(new BridgeToken__factory(deployer), []);

  // Mint 100,000,000,000 USDC to deployer
  await waitTx(USDC.mint(deployer.address, BigNumber.from(100).mul(1e9).mul(1e6), ZERO_ADDRESS, 0, id('0000'))); // $100bn

  const initializer = await deploy(new Initializer__factory(deployer), [DeepSquare.address, eligibility.address]);

  // Set the permissions
  await waitTx(spender.grantRole(await spender.SPENDER(), initializer.address));
  await waitTx(eligibility.grantRole(await eligibility.WRITER(), initializer.address));

  // Fork DPS balances
  const balances = await fetchBalances();

  balances.delete(GNOSIS_ADDRESS);
  balances.delete(PRIVATE_SALE2_ADDRESS);

  const balancesChunks = chunk([...balances.entries()], 200).map((c) => {
    return [c.map((entry) => entry[0]), c.map((entry) => entry[1])] as const;
  });

  await waitTx(DeepSquare.transfer(initializer.address, DPS_TOTAL_SUPPLY));
  let progress = new SingleBar({}, Presets.shades_classic);
  progress.start(balances.size, 0);

  for (const [investors, details] of balancesChunks) {
    await waitTx(initializer.airdrop(investors, details));
    progress.increment(investors.length);
  }

  progress.stop();

  // Fork verifications
  const verifications = await fetchValidations();

  const verificationsChunks = chunk([...verifications.entries()], 50).map((c) => {
    return [c.map((entry) => entry[0]), c.map((entry) => entry[1])] as const;
  });

  progress = new SingleBar({}, Presets.shades_classic);
  progress.start(verifications.size, 0);

  for (const [investors, details] of verificationsChunks) {
    await waitTx(initializer.setResults(investors, details));
    progress.increment(investors.length);
  }

  progress.stop();

  await waitTx(initializer.destruct());
  await waitTx(spender.revokeRole(await spender.SPENDER(), initializer.address));
  await waitTx(eligibility.revokeRole(await eligibility.WRITER(), initializer.address));

  // Deploy Sale
  const saleMainnet = Sale__factory.connect(PRIVATE_SALE2_ADDRESS, mainnet);
  const sale = await deploy(new Sale__factory(deployer), [
    DeepSquare.address,
    USDC.address,
    eligibility.address,
    '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD', // see https://docs.chain.link/docs/avalanche-price-feeds/#Avalanche%20Testnet
    40,
    BigNumber.from(250).mul(1e6),
    await saleMainnet.sold(),
  ]);

  await waitTx(DeepSquare.transfer(sale.address, await saleMainnet.remaining()));
  await waitTx(spender.grantRole(await spender.SPENDER(), sale.address));
  await waitTx(eligibility.grantRole(await eligibility.WRITER(), ELIGIBILITY_WRITER_ADDRESS));

  return {
    DeepSquare,
    USDC,
    eligibility,
    spender,
    sale,
  };
}
