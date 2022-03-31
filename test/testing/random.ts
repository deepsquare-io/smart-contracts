import { randomBytes } from 'crypto';
import { keccak256 } from '@ethersproject/keccak256';

/**
 * Returns a random number between min (inclusive) and max (inclusive).
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomResult(tier = 1) {
  return {
    tier,
    validator: 'Jumio Corporation',
    transactionId: keccak256(randomBytes(16)),
  };
}
