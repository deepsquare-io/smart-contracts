import { Presets, SingleBar } from 'cli-progress';
import { ethers } from 'hardhat';
import { parseEther } from '@ethersproject/units';
import mappings from '../data/mappings.json';
import { ReferralProgram__factory } from '../typings/factories/contracts/ReferralProgram__factory';

const LIMIT = parseEther('25000');

async function main() {
  const [deployer] = await ethers.getSigners();

  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(Object.keys(mappings).length, 0);

  const ReferralProgram = await new ReferralProgram__factory(deployer).deploy(
    '0xf192cae2e7cd4048bea307368015e3647c49338e',
    LIMIT,
  );

  await ReferralProgram.deliver(Object.keys(mappings), Object.values(mappings)); // order ?
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
