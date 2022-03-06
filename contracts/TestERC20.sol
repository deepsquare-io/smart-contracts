// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TestERC20 is ERC20 {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  constructor(uint _totalSupply) ERC20("USD Coin", "USDC.e") {
    _mint(msg.sender, _totalSupply);
  }

  function decimals() public view virtual override returns (uint8) {
    return 6;
  }
}
