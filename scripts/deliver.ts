import { Presets, SingleBar } from 'cli-progress';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
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

  const ReferralProgram = await new ReferralProgram__factory(deployer).deploy(
    '0xf192cae2e7cd4048bea307368015e3647c49338e',
    LIMIT,
  );

  for (const [beneficiary, referees] of Object.entries(mappings)) {
    progress.increment();
    ReferralProgram.verifyBeneficiary(beneficiary);

    const actualBalance = await DPS.balanceOf(beneficiary);

    if (actualBalance.lt(LIMIT)) {
      continue; // User has not invested enough to 25000 DPS
    }

    const gains = BigNumber.from(ReferralProgram.calculateGains(beneficiary, referees));
    if (gains.gt(0)) {
      amounts[beneficiary] = gains.toString();
    }
  }
  progress.stop();

  await ReferralProgram.deliver(Object.keys(amounts), Object.values(amounts)); // order ?
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
