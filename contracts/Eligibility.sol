// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title Eligibility.
 * @author Mathieu Bour, Julien Schneider
 * @dev Basic implementation of a KYC storage.
 */
contract Eligibility is AccessControl {
    struct Result {
        uint8 tier; // The KYC tier.
        string validator; // The KYC validator.
        string transactionId; // The KYC transaction id.
    }

    /**
     * @notice Map KYC tiers with their limits in USD. Zero means no-limit.
     */
    mapping(uint8 => uint256) public limits;

    /**
     * @notice Map accounts to a KYC tier.
     */
    mapping(address => Result) public results;

    /**
     * @notice The WRITER role which defines which account is allowed to write the KYC information.
     */
    bytes32 public constant WRITER = keccak256("WRITER");

    /**
     * @dev Grant the OWNER and WRITER roles to the contract deployer.
     */
    constructor() {
        // Define the roles
        _setRoleAdmin(WRITER, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WRITER, msg.sender);

        // Set the default KYC limits.
        setLimit(1, 15000);
        setLimit(2, 100000);
    }

    /**
     * @notice Set the limit of a given KYC tier. Zero means there is no limit. Restricted to the OWNER role.
     * @param tier The KYC tier.
     * @param newLimit The KYC tier limit.
     */
    function setLimit(uint8 tier, uint256 newLimit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        limits[tier] = newLimit;
    }

    /**
     * @notice Set the latest KYC result of an account. Restricted to the WRITER role.
     * @param account The account to check.
     * @param _result The account KYC result.
     */
    function setResult(address account, Result memory _result) external onlyRole(WRITER) {
        results[account] = _result;
    }
}
