// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControl.sol';
import './DeepSquare.sol';
import './DeepSquareSecurity.sol';

/**
 * @title SpenderSecurity
 * @notice Only SPENDER accounts transfer their DPS to someone else account.
 */
contract SpenderSecurity is DeepSquareSecurity, AccessControl {
  /// @dev The spender is allow to send his tokens to someone else, but not to move someone else DPS tokens
  bytes32 public constant SPENDER = keccak256('SPENDER');

  constructor(DeepSquare _DPS) DeepSquareSecurity(_DPS) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(SPENDER, msg.sender);
  }

  /**
   * @dev Check if the DPS transfer should be authorized.
   * Requirements
   * - the sender is the DeepSquare contract
   * - the sender is the owner OR the sender account is the same as the from account
   */
  function validateTokenTransfer(
    address sender,
    address from,
    address, // to, might be unused in another security contract in the future
    uint256 // amount, might be unused in another security contract in the future
  ) public view override onlyDeepSquare {
    // owner is allowed to call transferFrom(from, to, amount)
    // spenders are allowed to call transfer(to, amount)
    require(
      sender == DPS.owner() || sender == from,
      'SpenderSecurity: sender is not the DPS owner and tries to move funds'
    );

    _checkRole(SPENDER, sender);
  }
}
