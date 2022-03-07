// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './DeepSquare.sol';

/**
 * @dev Basic interface which controls if a DPS transfer should be authorized.
 */
abstract contract DeepSquareSecurity {
  DeepSquare DPS;

  /**
   * @param _DPS The DPS contract.
   */
  constructor(DeepSquare _DPS) {
    DPS = _DPS;
  }

  /**
   * @dev Restrict a call to the DeepSquare contract.
   */
  modifier onlyDeepSquare() {
    require(msg.sender == address(DPS), 'DeepSquareSecurity: only the DeepSquare contract can be the sender');
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
