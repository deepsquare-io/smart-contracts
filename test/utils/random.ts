/**
 * Returns a random number between min (inclusive) and max (inclusive).
 */
import { BigNumber } from 'ethers';

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 2^256 max uint
// 210m * 1e18 * 1e6
// log2(210e30) ~= 107
// BigNumber.from(210).mul(1e6).mul(1e9).mul(1e9).mul(1e6);
// 210e30
