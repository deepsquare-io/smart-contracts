import { BaseContract } from '@ethersproject/contracts';
import ISecurity from './interfaces/ISecurity';
import AccessControl from './openzeppelin/AccessControl';

export default interface SpenderSecurity extends AccessControl, ISecurity, BaseContract {
  SPENDER(): Promise<string>;
}
