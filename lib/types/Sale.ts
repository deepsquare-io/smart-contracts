import { BaseContract, BigNumber } from 'ethers';
import Ownable from './openzeppelin/Ownable';

export interface Sale extends BaseContract, Ownable {
  DPS(): Promise<string>;

  STC(): Promise<string>;

  eligibility(): Promise<string>;

  rate(): Promise<number>;

  minimumPurchaseSTC(): Promise<BigNumber>;

  sold(): Promise<BigNumber>;
}
