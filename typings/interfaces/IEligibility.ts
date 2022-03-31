import { BigNumber } from '@ethersproject/bignumber';

export default interface IEligibility {
  /**
   * @notice Get the tier and limit for an account.
   * @param account The account address to lookup.
   * @returns [tier, limit]
   */
  lookup(account: string): Promise<[number, BigNumber]>;
}
