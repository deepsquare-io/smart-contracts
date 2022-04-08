import { Presets, SingleBar } from 'cli-progress';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import mappings from '../data/mappings.json';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { ReferralProgram__factory } from '../typings/factories/contracts/ReferralProgram__factory';

const LIMIT = parseEther('25000');

async function main() {
  const [deployer] = await ethers.getSigners();
  const DPS = new DeepSquare__factory(deployer).attach('0xf192cae2e7cd4048bea307368015e3647c49338e');
  const amounts: Record<string, string> = {};

  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(Object.keys(mappings).length, 0);

  for (const [beneficiary, referees] of Object.entries(mappings)) {
    progress.increment();
    const actualBalance = await DPS.balanceOf(beneficiary);

    if (actualBalance.lt(LIMIT)) {
      continue; // User has not invested enough to 25000 DPS
    }

    const balances = await Promise.all(referees.map((referee) => DPS.balanceOf(referee)));
    const sum = balances.reduce((total, value) => total.add(value), BigNumber.from(0));

    if (sum.gt(0)) {
      amounts[beneficiary] = sum.mul(12).div(100).toString();
    }
  }
  progress.stop();

  // deliver the DPS to the referrers, but we need to have at least the sum of the referral gains
  // for (const [beneficiary, amount] of Object.entries(amounts)) {
  //   await DPS.transfer(beneficiary, amount); // but we need some DPS!! // 1 AVAX tx
  // }

  const ReferralProgram = await new ReferralProgram__factory(deployer).deploy(
    '0xf192cae2e7cd4048bea307368015e3647c49338e',
  );

  await ReferralProgram.deliver(Object.keys(amounts), Object.values(amounts)); // order ?
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
