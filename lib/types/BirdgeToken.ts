import { BigNumberish, providers } from 'ethers';
import IERC20 from './openzeppelin/IERC20';
import IERC20Metadata from './openzeppelin/IERC20Metadata';

export default interface BridgeToken extends IERC20, IERC20Metadata {
  mint(
    to: string,
    amount: BigNumberish,
    feeAddress: string,
    feeAmount: BigNumberish,
    originTxId: string,
  ): Promise<providers.TransactionResponse>;
}
