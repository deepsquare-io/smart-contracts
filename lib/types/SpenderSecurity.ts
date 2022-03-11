import { BaseContract } from 'ethers';
import AccessControl from './openzeppelin/AccessControl';

export default interface SpenderSecurity extends BaseContract, AccessControl {
  SPENDER(): Promise<string>;
}
