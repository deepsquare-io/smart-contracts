// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './ERC20Ownable.sol';

/**
 * @dev Basic interface which controls if a DPS transfer should be authorized.
 */
abstract contract ERC20Security {
  ERC20Ownable token;

  /**
   * @param _token The ERC20Ownable contract.
   */
  constructor(ERC20Ownable _token) {
    token = _token;
  }

  /**
   * @dev Restrict a call to the DeepSquare contract.
   */
  modifier onlyERC20() {
    require(msg.sender == address(token), 'ERC20Security: only the configured ERC20 contract can be the sender');
    _;
  }

  /**
   * @dev Check if the transfer can occur.
   */
  function validateTokenTransfer(
    address sender,
    address from,
    address to,
    uint256 amount
  ) public view virtual;
}
