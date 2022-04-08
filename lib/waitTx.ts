import { TransactionResponse } from '@ethersproject/providers';

/**
 * Wait for a transaction to be confirmed by the network.
 * Since we are using Avalanche, we do not have to wait for more than one confirmation.
 *
 * Extracted from the Avalanche documentation: https://docs.avax.network/build/tutorials/platform/launch-your-ethereum-dapp/#finality
 * > On Ethereum, the blockchain can be reorganized and blocks can be orphaned, so you cannot rely on the fact that a
 * > block has been accepted until it is several blocks further from the tip (usually, it is presumed that blocks 6
 * > places deep are safe). That is not the case on Avalanche. Blocks are either accepted or rejected within a second
 * > or two. And once the block has been accepted, it is final, and cannot be replaced, dropped, or modified. So the
 * > concept of 'number of confirmations' on Avalanche is not used. As soon as a block is accepted and available in
 * > the explorer, it is final.
 * @param {Promise<TransactionResponse>} tx
 * @param {number} confirmations
 * @returns {Promise<TransactionReceipt>}
 */
export default async function waitTx(tx: Promise<TransactionResponse>, confirmations?: number) {
  const response = await tx;
  return await response.wait(confirmations);
}
