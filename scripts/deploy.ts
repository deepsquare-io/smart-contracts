import { Presets, SingleBar } from 'cli-progress';
import { ethers, network } from 'hardhat';
import chunk from 'lodash/chunk';
import { BigNumber } from '@ethersproject/bignumber';
import deploy from '../lib/deploy';
import fetchBalances from '../lib/fetch/fetchBalances';
import fork from '../lib/fork';
import waitTx from '../lib/waitTx';
import { Bridge__factory } from '../typings/factories/contracts/Bridge__factory';
import { LockingSecurity__factory } from '../typings/factories/contracts/LockingSecurity__factory';
import { Square__factory } from '../typings/factories/contracts/Square__factory';

async function main() {
  if (network.name === 'mainnet') {
    throw new Error('TODO');
  }

  const { DeepSquare, eligibility, sale } = await fork();
  const [deployer] = await ethers.getSigners();

  const LockingSecurityFactory = new LockingSecurity__factory(deployer);
  const LockingSecurity = await deploy(LockingSecurityFactory, [DeepSquare.address]);
  await waitTx(LockingSecurity.grantRole(await LockingSecurity.SALE(), LockingSecurity.address));
  await waitTx(LockingSecurity.grantRole(await LockingSecurity.SALE(), sale.address));
  await waitTx(DeepSquare.setSecurity(LockingSecurity.address));

  const progress = new SingleBar({}, Presets.shades_classic);
  const locks = [];

  for (const [user, balance] of (await fetchBalances()).entries()) {
    locks.push(
      // 25%
      {
        user,
        value: BigNumber.from(balance).mul(25).div(100),
        release: Math.floor(Date.now() / 1000) + 4 * 3600,
      },

      // 75%
      {
        user,
        value: BigNumber.from(balance).mul(75).div(100),
        release: Math.floor(Date.now() / 1000) + 20 * 3600,
      },
    );
  }

  const chunks = chunk(locks, 100).map((lls) => {
    return [
      lls.map((l) => l.user), // accounts
      lls.map((l) => ({ value: l.value, release: l.release })), // details
    ] as const;
  });

  progress.start(locks.length, 0);

  for (const [investors, details] of chunks) {
    await waitTx(LockingSecurity.lockBatch(investors, details));
    progress.increment(investors.length);
  }

  progress.stop();

  // Deploy SQR and bridge
  const Square = await deploy(new Square__factory(deployer), []);
  const bridge = await deploy(new Bridge__factory(deployer), [DeepSquare.address, Square.address, eligibility.address]);
  await waitTx(Square.transfer(bridge.address, await Square.balanceOf(deployer.address)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
