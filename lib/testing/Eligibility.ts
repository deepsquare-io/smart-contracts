import { randomBytes } from 'crypto';
import { ethers } from 'hardhat';

export function makeResult(tier: 0 | 1 | 2 | 3 = 1) {
  return {
    tier,
    validator: 'Jumio Corporation',
    transactionId: ethers.utils.keccak256(randomBytes(16)),
  };
}
