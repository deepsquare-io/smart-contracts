import { providers, BaseContract, BigNumberish, BigNumber } from 'ethers';

/**
 * @see @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol
 */
export default interface IERC20Metadata extends BaseContract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
}
