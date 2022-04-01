import IERC20 from './IERC20';

/**
 * @see @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol
 */
export default interface IERC20Metadata extends IERC20 {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
}
