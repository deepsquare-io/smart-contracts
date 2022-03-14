import { BigNumber, utils } from 'ethers';
import legacyDPS from '../../lib/ethereum/legacyDPS';

/** @type {BigNumber} Private sale phase 1 */
const PHASE1 = utils.parseUnits('10000000', 6); // 10 million DPS
const PHASE2 = utils.parseUnits('7500000', 6); // 7.5 million DPS

/**
 * Get the legacy state of the DPS token running on the Ethereum blockchain.
 * @return {Promise<{sold: BigNumber, remaining: BigNumber}>}
 */
export default async function getLegacyState() {
  const [totalSupply, ownerBalance] = await Promise.all([
    legacyDPS.totalSupply(),
    legacyDPS.balanceOf(await legacyDPS.owner()),
  ]);

  const remaining = ownerBalance.sub(totalSupply.sub(PHASE1).sub(PHASE2));

  return {
    sold: PHASE2.sub(remaining).mul(1e12),
    remaining: remaining.mul(1e12),
  };
}
