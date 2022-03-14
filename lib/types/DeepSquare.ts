import { BaseContract, BigNumberish, providers } from 'ethers';
import IERC20 from './openzeppelin/IERC20';
import IERC20Metadata from './openzeppelin/IERC20Metadata';
import Ownable from './openzeppelin/Ownable';

export default interface DeepSquare extends IERC20, IERC20Metadata, Ownable, BaseContract {
  security(): Promise<string>;
  transferBatch(recipients: string[], amounts: BigNumberish[]): Promise<providers.TransactionResponse>;
}
