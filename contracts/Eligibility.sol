// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Context.sol';

/**
 * @author Mathieu Bour, Julien Schneider
 * @dev Basic implementation of a KYC storage.
 */
contract Eligibility is AccessControl {
  struct Result {
    uint8 tier;
    string validator; // Jumio, etc.
    string transactionId;
  }

  /**
   * @dev Map KYC tiers with their limits in USD. Zero means no-limit.
   */
  mapping(uint8 => uint256) public limits;

  /**
   * @dev Map accounts to a KYC tier.
   */
  mapping(address => Result) public results;

  /**
   * @dev The OWNER role which defines which account is allowed to grant the WRITE role.
   */
  bytes32 public constant OWNER = keccak256('OWNER');

  /**
   * @dev The WRITER rol which defines which account is allowed to write the KYC information.
   */
  bytes32 public constant WRITER = keccak256('WRITER');

  /**
   * @dev Grant the OWNER and WRITER roles to the deployer.
   */
  constructor() {
    // Define the roles
    _setRoleAdmin(WRITER, OWNER);
    _grantRole(OWNER, msg.sender);
    _grantRole(WRITER, msg.sender);

    // Configure the default limits
    setLimit(1, 15000);
    setLimit(2, 100000);
  }

  /**
   * @dev Get the limit of a KYC tier, zero means that there is no limit.
   */
  function limit(uint8 tier) external view returns (uint256) {
    return limits[tier];
  }

  /**
   * @dev Set the limit of a KYC tier, zero means that there is no limit. Restricted to the OWNER role.
   */
  function setLimit(uint8 tier, uint256 newLimit) public onlyRole(OWNER) {
    limits[tier] = newLimit;
  }

  /**
   * @dev Get the latest KYC result of an account.
   * @param account the account to check
   */
  function result(address account) external view returns (Result memory) {
    return results[account];
  }

  /**
   * @dev Set the latest KYC result of an account. Restricted to the WRITER role.
   */
  function setResult(address account, Result memory _result) external onlyRole(WRITER) {
    results[account] = _result;
  }
}
