// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './ERC20Ownable.sol';

/**
 * @title ERC20Security
 * @author Mathieu Bour
 * @notice Expose a validation function to restrict ERC20 transfers.
 * @dev This contract must be inherit and the validateTokenTransfer function overloaded with the appropriate logic.
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
   * @notice Restrict a call to the underlying ERC20 contract.
   */
  modifier onlyERC20() {
    require(msg.sender == address(token), 'ERC20Security: only the configured ERC20 contract can be the sender');
    _;
  }

  /**
   * @notice Check if the transfer triggered by `sender` of `amount` can occur from `from` to `to`.
   * @param sender The account which triggered the transfer.
   * @param from The account from where the tokens will be taken.
   * @param to The account where the tokens will be sent.
   * @param amount The token amount.
   */
  function validateTokenTransfer(
    address sender,
    address from,
    address to,
    uint256 amount
  ) public view virtual;
}
