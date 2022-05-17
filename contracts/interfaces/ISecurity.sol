// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ISecurity
 * @author Mathieu Bour, Julien Schneider, Charly Mancel, Valentin Pollart and Clarisse Tarrou for the DeepSquare Association.
 * @notice Expose a validation function to restrict ERC20 transfers.
 * @dev This contract must be inherit and the validateTokenTransfer function overloaded with the appropriate logic.
 */
interface ISecurity {
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
    ) external;
}
