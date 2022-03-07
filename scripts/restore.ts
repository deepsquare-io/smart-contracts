import { Presets, SingleBar } from 'cli-progress';
import 'dotenv/config';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import accounts from './data/state.json';

interface Account {
  address: string;
  kyc: number;
  balance_uDPS: string;
}

async function main() {
  const DPS = await ethers.getContractFactory('DeepSquare').then((factory) => factory.attach(process.env.DPS_ADDRESS!));
  const [owner] = await ethers.getSigners();
  const balance = new SingleBar({}, Presets.shades_classic);
  balance.start(accounts.length, 0);

  for (const account of accounts) {
    const balance_wDPS = BigNumber.from(account.balance_uDPS).mul(1e6).mul(1e6);
    const actual: BigNumber = await DPS.balanceOf(account.address);

    if (!balance_wDPS.isZero() && actual.lt(balance_wDPS)) {
      const tx = await DPS.transfer(account.address, balance_wDPS.sub(actual));
      await tx.wait(2);
    }

    balance.increment();
  }

  balance.stop();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
