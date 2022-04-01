import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BaseContract, CallOverrides } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';
import Ownable from './openzeppelin/Ownable';

export default interface Sale extends BaseContract, Ownable {
  /**
   * The DPS token contract being sold.
   */
  DPS(): Promise<string>;

  /**
   * The stablecoin ERC20 contract.
   */
  STC(): Promise<string>;

  /**
   * The eligibility contract.
   */
  eligibility(): Promise<string>;

  /**
   * The Chainlink AVAX/USD pair aggregator contract.
   */
  aggregator(): Promise<string>;

  /**
   * How many cents costs a DPS (e.g., 40 means a single DPS token costs 0.40 STC).
   */
  rate(): Promise<number>;

  /**
   * The minimum DPS purchase amount in stablecoin.
   */
  minimumPurchaseSTC(): Promise<BigNumber>;

  /**
   * How many DPS tokens were sold during the sale.
   */
  sold(): Promise<BigNumber>;

  /**
   * Set a new aggregator contract.
   */
  setAggregator(newAggregator: string): Promise<TransactionResponse>;

  /**
   * Convert an AVAX amount to its equivalent of the stablecoin.
   * This allows to handle the AVAX purchase the same way as the stablecoin purchases.
   * @param amountAVAX The amount in AVAX wei.
   * @return The amount in STC.
   */
  convertAVAXtoSTC(amountAVAX: BigNumberish): Promise<BigNumber>;

  /**
   * Convert a stablecoin amount in DPS.
   * @param amountSTC The amount in STC.
   * @return The amount in DPS.
   */
  convertSTCtoDPS(amountSTC: BigNumberish): Promise<BigNumber>;

  /**
   * Convert a DPS amount in stablecoin.
   * @param amountDPS The amount in DPS.
   * @return The amount in stablecoin.
   */
  convertDPStoSTC(amountDPS: BigNumberish): Promise<BigNumber>;

  /**
   * Get the remaining DPS tokens to sell.
   * @return The amount of DPS remaining in the sale.
   */
  remaining(): Promise<BigNumber>;

  /**
   * Get the raised stablecoin amount.
   * @return The amount of stable coin raised in the sale.
   */
  raised(): Promise<BigNumber>;

  /**
   * Purchase DPS with AVAX native currency.
   * The invested amount will be msg.value.
   * @param {CallOverrides} overrides The ethers call overrides.
   */
  purchaseDPSWithAVAX(overrides?: CallOverrides): Promise<TransactionResponse>;

  /**
   * Purchase DPS with stablecoin.
   * @param amountSTC The amount of stablecoin to invest.
   */
  purchaseDPSWithSTC(amountSTC: BigNumberish): Promise<TransactionResponse>;

  /**
   * Deliver DPS tokens to an investor. Restricted to the sale OWNER.
   * @param amountSTC The amount of stablecoins invested, no minimum amount.
   * @param account The investor address.
   */
  deliverDPS(amountSTC: BigNumberish, account: string): Promise<TransactionResponse>;

  /**
   * Close the sale by sending the remaining tokens back to the owner and then renouncing ownership.
   */
  close(): Promise<TransactionResponse>;
}
