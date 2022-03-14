import { BigNumber } from 'ethers';

export default function e(n: number) {
  return BigNumber.from(10).pow(n);
}
