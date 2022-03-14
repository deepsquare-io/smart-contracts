// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Eligibility.
 * @author Mathieu Bour, Julien Schneider, Charly Mancel, Valentin Pollart and Clarisse Tarrou for the DeepSquare Association.
 * @dev Defines a basic protocol (tier, limit) to verify the accounts KYC.
 */
interface IEligibility {
    /**
     * @notice Get the tier and limit for an account.
     * @param account The account address to lookup.
     */
    function lookup(address account) external returns (uint8, uint256);
}
