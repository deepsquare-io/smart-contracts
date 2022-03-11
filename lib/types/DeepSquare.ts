import { BaseContract } from 'ethers';
import IERC20 from './openzeppelin/IERC20';
import Ownable from './openzeppelin/Ownable';

type DeepSquare = IERC20 & Ownable & BaseContract;
export default DeepSquare;
