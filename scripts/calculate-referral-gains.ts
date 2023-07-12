import { Presets, SingleBar } from 'cli-progress';
import * as fs from 'fs';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import blacklist from '../data/blacklist_referral.json';
import nonPurchasedDPS from '../data/non_purchased_dps.json';
import rawReferrals from '../data/referrals.json';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';

const LIMIT = parseEther('25000');

interface NonPurchased {
  [vault: string]: {
    [address: string]: number;
  };
}

const nonPurchased: NonPurchased = nonPurchasedDPS;

async function main() {
  const [deployer] = await ethers.getSigners();
  const DPS = new DeepSquare__factory(deployer).attach('0xf192cae2e7cd4048bea307368015e3647c49338e');
  const amounts: Record<string, [string, string]> = {};

  // Convert blacklisted addresses to lower case
  const blacklisted_addresses = blacklist.blacklisted_addresses.map((address) => address.toLowerCase());

  const progress = new SingleBar({}, Presets.shades_classic);

  progress.start(Object.keys(rawReferrals).length, 0);

  for (const [beneficiary, referees] of Object.entries(rawReferrals)) {
    // If beneficiary is in blacklist, skip
    if (blacklisted_addresses.includes(beneficiary.toLowerCase())) {
      continue;
    }
    progress.increment();
    const actualBalance = await DPS.balanceOf(beneficiary);

    if (actualBalance.lt(LIMIT)) {
      continue; // User has not invested enough to 25000 DPS
    }

    let nonPurchasedAmount = BigNumber.from(0);
    for (const vault in nonPurchased) {
      for (const [referee, amount] of Object.entries(nonPurchased[vault])) {
        // Check if referees includes referee in a case-insensitive manner
        if (referees.map((ref) => ref.toLowerCase()).includes(referee.toLowerCase())) {
          // Convert the non-purchased amount to WEI.
          const amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
          nonPurchasedAmount = nonPurchasedAmount.add(BigNumber.from(amountInWei));
        }
      }
    }

    const balances = await Promise.all(referees.map((referee) => DPS.balanceOf(referee)));
    const sum = balances.reduce((total, value) => total.add(value), BigNumber.from(0)).sub(nonPurchasedAmount);

    if (sum.gt(0)) {
      amounts[beneficiary] = [actualBalance.toString(), sum.mul(12).div(100).toString()];
    }
  }
  progress.stop();

  const convertToCsv = (record: Record<string, [string, string]>): string => {
    return `Wallet,Referral gains\n${Object.entries(record).reduce(
      (sum, entry) => `${sum}\n${entry[0]},${ethers.utils.formatEther(entry[1][1])}`,
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
