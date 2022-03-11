import { providers } from 'ethers';

/**
 * Wait for transaction to be mined.
 * @param {Promise<providers.TransactionResponse>} tx The transaction to wait.
 * @param {number} confirmations How many confirmation to wait for.
 * @return {Promise<void>}
 */
export default async function waitTx(
  tx: Promise<providers.TransactionResponse>,
  confirmations?: number,
): Promise<void> {
  const response = await tx;
  await response.wait(confirmations);
}
