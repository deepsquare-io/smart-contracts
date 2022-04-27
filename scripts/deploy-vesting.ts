import { Presets, SingleBar } from 'cli-progress';
import { existsSync, readFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { ethers, network } from 'hardhat';
import { join } from 'path';
import { BigNumber } from '@ethersproject/bignumber';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
// import users from '../data/users.json';
import { ZERO_ADDRESS } from '../lib/constants';
import waitTx from '../lib/waitTx';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { LockingSecurity__factory } from '../typings/factories/contracts/LockingSecurity__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'DeepSquare' | 'Sale';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  DeepSquare: {
    hardhat: '0x270D1399744874C72f95873eB9606172D155669D',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x270D1399744874C72f95873eB9606172D155669D',
  },
  Sale: {
    hardhat: '0x393C042f655Aa6D7Fd9F7cc8418bE0023dc1DcA4',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '0x393C042f655Aa6D7Fd9F7cc8418bE0023dc1DcA4',
  },
};

/**
 * Get the balances of the current DPS holders.
 * @param {boolean} refresh Get fresh data from the blockchain (take approx. 3 minutes).
 * @returns {Promise<Map<string, BigNumber>>}
 */
async function getBalances(refresh = false): Promise<Map<string, BigNumber>> {
  const cacheFile = join(__dirname, '..', 'data', 'holders.json');

  if (!refresh && existsSync(cacheFile)) {
    console.log('Using cached mappings:', cacheFile);
    const raw: Record<string, string> = JSON.parse(await readFile(cacheFile, { encoding: 'utf-8' }));
    const map = new Map<string, BigNumber>();

    for (const [h, rawB] of Object.entries(raw)) {
      map.set(h, BigNumber.from(rawB));
    }

    return map;
  }

  const mainnet = new StaticJsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
  const DPSmainnet = DeepSquare__factory.connect('0xf192cae2e7cd4048bea307368015e3647c49338e', mainnet);

  const holders = new Set<string>();

  const start = 12109726;
  const end = await mainnet.getBlockNumber();

  let i = start;

  const progress = new SingleBar({}, Presets.shades_classic);

  console.log('Retrieving DPS holders');
  progress.start(end - start, 0);

  while (i < end) {
    const to = i + 2048 > end ? end : i + 2048;
    const events = await DPSmainnet.queryFilter(DPSmainnet.filters.Transfer(), i, to);

    for (const event of events) {
      holders.add(event.args['to']);
    }

    i = to;
    progress.update(i - start);
  }

  progress.stop();

  holders.delete('0xaEAE6CA5a34327b557181ae1E9E62BF2B5eB1D7F'); // gnosis safe
  holders.delete('0x8c94e12C2d05b2060DF9D9732980bca363F3F58a'); // sale contract
  holders.delete('0xb4A981d2663455aEE53193Da8e7c61c3579301cb'); // sale contract
  holders.delete('0xDA0096EB18c43A84f9E2EEF7FE6B7eD0Be29fEFa'); // deployment address
  holders.delete('0xC891fCbF84423dCeda561bB95388efFDb376C322'); // airdrop

  const balances = new Map<string, BigNumber>();

  console.log('Fetch DPS balances');
  progress.start(holders.size, 0);
  const fetch = [...holders].map(async (h) => {
    balances.set(h, await DPSmainnet.balanceOf(h));
    progress.increment();
  });
  await Promise.all(fetch);
  progress.stop();

  const dict: Record<string, string> = {};

  for (const [h, b] of balances.entries()) {
    dict[h] = b.toString();
  }

  await writeFile(cacheFile, JSON.stringify(dict, null, 2));
  console.log('Wrote mappings:', cacheFile);

  return balances;
}

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer] = await ethers.getSigners();

  const balances = await getBalances();

  console.log('Network: ', networkName);
  console.log('Deployer: ', deployer.address);

  let DeepSquare: DeepSquare;
  if (networkName === 'mainnet') {
    const DeepSquareFactory = new DeepSquare__factory(deployer);
    DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);
  } else {
    const DeepSquareFactory = new DeepSquare__factory(deployer);
    DeepSquare = await DeepSquareFactory.deploy(ZERO_ADDRESS);
    await DeepSquare.deployed();
  }

  console.log('DPS:', DeepSquare.address);

  const LockingSecurityFactory = new LockingSecurity__factory(deployer);
  const LockingSecurity = await LockingSecurityFactory.deploy(DeepSquare.address);
  await LockingSecurity.deployed();
  console.log('LockingSecurity:', LockingSecurity.address);

  const gnosisAddress = await LockingSecurity.owner();
  console.log('LockingSecurity.owner:', await LockingSecurity.owner());
  console.log('TEST:', await LockingSecurity.hasRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), deployer.address));

  if (networkName !== 'mainnet') {
    await waitTx(DeepSquare.setSecurity(LockingSecurity.address));
    console.log('Security: OK');

    await waitTx(LockingSecurity.grantRole(await LockingSecurity.SALE(), LockingSecurity.address));

    await waitTx(DeepSquare.approve(LockingSecurity.address, await DeepSquare.balanceOf(deployer.address)));
    console.log('Approve: OK');

    console.log(await DeepSquare.allowance(deployer.address, LockingSecurity.address));
    console.log('Owner balance:', await DeepSquare.balanceOf(deployer.address));

    const progress = new SingleBar({}, Presets.shades_classic);
    progress.start(balances.size, 0);

    for (const [user, balance] of balances.entries()) {
      progress.increment();

      // 25%
      await waitTx(
        LockingSecurity.vest(user, {
          value: BigNumber.from(balance).mul(25).div(100),
          release: Math.floor(Date.now() / 1000) + 4 * 3600,
        }),
      );

      // 75%
      await waitTx(
        LockingSecurity.vest(user, {
          value: BigNumber.from(balance).mul(75).div(100),
          release: Math.floor(Date.now() / 1000) + 20 * 3600,
        }),
      );
    }

    progress.stop();
  }

  await LockingSecurity.grantRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), gnosisAddress);
  await LockingSecurity.grantRole(await LockingSecurity.SALE(), addresses.Sale[networkName]);
  await LockingSecurity.renounceRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), deployer.address);
  await LockingSecurity.transferOwnership(gnosisAddress);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
