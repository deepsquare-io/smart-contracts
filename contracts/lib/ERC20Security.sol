// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ERC20Security
 * @author Mathieu Bour
 * @notice Expose a validation function to restrict ERC20 transfers.
 * @dev This contract must be inherit and the validateTokenTransfer function overloaded with the appropriate logic.
 */
interface ERC20Security {
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
  ) external view;
}
