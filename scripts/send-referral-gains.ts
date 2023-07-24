import { ethers } from 'hardhat';
import { formatUnits } from '@ethersproject/units';
import rawGains from '../data/gains.json';
import waitTx from '../lib/waitTx';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';

async function main() {
  const [deployer] = await ethers.getSigners();
  const DPS = new DeepSquare__factory(deployer).attach('0xf192cae2e7cd4048bea307368015e3647c49338e');

  const gains: { [address: string]: string } = rawGains;

  for (const referrer of Object.keys(gains)) {
    await waitTx(DPS.transfer(referrer, gains[referrer]));
    console.log('transfering ' + formatUnits(gains[referrer], 'ether') + ' to ' + referrer);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
