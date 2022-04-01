import type { BaseContract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';
import type IERC20 from './openzeppelin/IERC20';
import type IERC20Metadata from './openzeppelin/IERC20Metadata';
import type Ownable from './openzeppelin/Ownable';

export default interface DeepSquare extends IERC20, IERC20Metadata, Ownable, BaseContract {
  /**
   * The security which controls the token transfers.
   */
  security(): Promise<string>;

  /**
   * Set the security contract which manages the token transfer restrictions.
   * @param newSecurity The new security contract.
   */
  setSecurity(newSecurity: string): Promise<TransactionResponse>;
}
