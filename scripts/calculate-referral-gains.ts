import { Presets, SingleBar } from 'cli-progress';
import * as fs from 'fs';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import rawReferrals from '../data/referrals.json';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';

const LIMIT = parseEther('25000');

async function main() {
  const [deployer] = await ethers.getSigners();
  const DPS = new DeepSquare__factory(deployer).attach('0xf192cae2e7cd4048bea307368015e3647c49338e');
  const amounts: Record<string, [string, string]> = {};

  const progress = new SingleBar({}, Presets.shades_classic);

  progress.start(Object.keys(rawReferrals).length, 0);

  for (const [beneficiary, referees] of Object.entries(rawReferrals)) {
    progress.increment();
    const actualBalance = await DPS.balanceOf(beneficiary);

    if (actualBalance.lt(LIMIT)) {
      continue; // User has not invested enough to 25000 DPS
    }

    const balances = await Promise.all(referees.map((referee) => DPS.balanceOf(referee)));
    const sum = balances.reduce((total, value) => total.add(value), BigNumber.from(0));

    if (sum.gt(0)) {
      amounts[beneficiary] = [actualBalance.toString(), sum.mul(12).div(100).toString()];
    }
  }
  progress.stop();

  const convertToCsv = (record: Record<string, [string, string]>): string => {
    return `Wallet,DPS bought,Referral gains\n${Object.entries(record).reduce(
      (sum, entry) => `${sum}\n${entry[0]},${entry[1][0]},${entry[1][1]}`,
      '',
    )}`;
  };

  const writeRecordToFile = (record: Record<string, [string, string]>, filePath: string): void => {
    const csvData = convertToCsv(record);

    fs.writeFile(filePath, csvData, (err) => {
      if (err) {
        console.error('An error occurred while writing the file:', err);
        return;
      }

      console.log('Record successfully written to file.');
    });
  };

  writeRecordToFile(amounts, './data/gains.csv');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
