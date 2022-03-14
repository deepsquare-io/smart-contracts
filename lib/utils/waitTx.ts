import { providers } from 'ethers';

/**
 * Wait for transaction to be mined.
 * @param {Promise<providers.TransactionResponse>} tx The transaction to wait.
 * @param {number} confirmations How many confirmation to wait for.
 * @return {Promise<providers.TransactionReceipt>}
 */
export default async function waitTx(
  tx: Promise<providers.TransactionResponse>,
  confirmations?: number,
): Promise<providers.TransactionReceipt> {
  const response = await tx;
  return await response.wait(confirmations);
}
