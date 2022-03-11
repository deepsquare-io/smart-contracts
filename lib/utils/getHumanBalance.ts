import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export default async function getHumanBalance(account: SignerWithAddress, decimals = 2) {
  const balance = await account.getBalance();
  const raw = balance.div(BigNumber.from(10).pow(18 - decimals)).toNumber() / 10 ** decimals;
  return parseFloat(raw.toFixed(decimals));
}
