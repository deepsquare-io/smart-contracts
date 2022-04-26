import { Presets, SingleBar } from 'cli-progress';
import { ethers, network } from 'hardhat';
import { parseEther } from '@ethersproject/units';
import mappings from '../data/mappings.json';
import waitTx from '../lib/waitTx';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { ReferralProgram__factory } from '../typings/factories/contracts/ReferralProgram__factory';
import { SpenderSecurity__factory } from '../typings/factories/contracts/SpenderSecurity__factory';

const LIMIT = parseEther('25000');
const GNOSIS = '0xaEAE6CA5a34327b557181ae1E9E62BF2B5eB1D7F'; // Current sale gnosis safe

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Attach SpenderSecurity...');
  const Security = new SpenderSecurity__factory(deployer).attach('0x3c603bf311acffcd2d4bb2cf14df437d429f1077');
  console.log('Attach DeepSquare token...');
  const DeepSquare = new DeepSquare__factory(deployer).attach('0xf192cae2e7cd4048bea307368015e3647c49338e');
  console.log('Deploy ReferralProgram contract...');
  const ReferralProgram = await new ReferralProgram__factory(deployer).deploy(DeepSquare.address, LIMIT);

  console.log('Confirm transactions...');
  await network.provider.request({ method: 'hardhat_impersonateAccount', params: [GNOSIS] });
  const gnosis = await ethers.getSigner(GNOSIS);
  await waitTx(Security.connect(gnosis).grantRole(await Security.SPENDER(), ReferralProgram.address));
  await waitTx(DeepSquare.connect(gnosis).transfer(ReferralProgram.address, parseEther('10000000')));
  await network.provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [GNOSIS] });

  const referrers: string[] = [];
  const referees: string[][] = [];

  console.log('Create ReferralProgram arguments...');
  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(Object.keys(mappings).length, 0);
  for (const [theReferrer, theReferees] of Object.entries(mappings)) {
    progress.increment();
    if ((await DeepSquare.balanceOf(theReferrer)).lt(LIMIT)) {
      continue;
    }

    referrers.push(theReferrer);
    referees.push(theReferees);
  }
  progress.stop();

  console.log('Deliver referral gains...');
  await ReferralProgram.deliver(referrers, referees);
  console.log(
    'Referral program cost: ' +
      parseEther('10000000')
        .sub(await DeepSquare.balanceOf(ReferralProgram.address))
        .div('1000000000000000000')
        .toString() +
      'DPS',
  );
  await ReferralProgram.transferOwnership(gnosis.address);
  await network.provider.request({ method: 'hardhat_impersonateAccount', params: [GNOSIS] });
  await waitTx(ReferralProgram.connect(gnosis).destruct());
  await network.provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [GNOSIS] });
  console.log('End of the process.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
