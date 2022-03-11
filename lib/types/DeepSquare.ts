import { BaseContract } from 'ethers';
import IERC20 from './openzeppelin/IERC20';
import Ownable from './openzeppelin/Ownable';

export default interface DeepSquare extends IERC20, Ownable, BaseContract {
  security(): Promise<string>;
}
