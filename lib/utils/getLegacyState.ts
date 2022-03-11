import { BigNumber, Contract, providers, utils } from 'ethers';
import SquareFundRaiseABI from '../../scripts/SquareFundRaiser.abi.json';

const LEGACY_DPS = '0x8DFFCD9a2F392451e0cE7A1F0D73D65C5807ECd3';
const RPC_URL = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'; // MetaMask
const PHASE1 = utils.parseUnits('10000000', 6); // 10 million DPS
const PHASE2 = utils.parseUnits('7500000', 6); // 7.5 million DPS

/**
 * Get the legacy state of the DPS token running on the Ethereum blockchain.
 * @return {Promise<{sold: BigNumber, remaining: BigNumber}>}
 */
export default async function getLegacyState() {
  const legacyDPS = new Contract(LEGACY_DPS, SquareFundRaiseABI, new providers.JsonRpcProvider(RPC_URL));

  const [totalSupply, ownerBalance]: [BigNumber, BigNumber] = await Promise.all([
    legacyDPS.totalSupply(),
    legacyDPS.balanceOf(await legacyDPS.owner()),
  ]);

  const remaining = ownerBalance.sub(totalSupply.sub(PHASE1).sub(PHASE2));

  return {
    sold: PHASE2.sub(remaining).mul(1e12),
    remaining: remaining.mul(1e12),
  };
}
