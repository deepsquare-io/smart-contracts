// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @dev Control the eligibility of the wallets.
 */
contract Eligibility is AccessControl {
  struct Result {
    uint8 tier;
    string validator; // Jumio, etc.
    string transactionId;
  }

  /**
   * The mappings which associate an account to a KYC tier level.
   */
  mapping(address => Result) public results;

  /**
   * @dev The WRITER rol which defines which account is allowed to write the KYC informations.
   */
  bytes32 public constant WRITER = keccak256("WRITER");

  /**
   * @dev Grant the admin role to the deployer.
   */
  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function addWriter(address account) external {
    grantRole(WRITER, account);
  }

  function removeWriter(address account) external  {
    revokeRole(WRITER, account);
  }

  function result(address account) view external returns (Result memory) {
    return results[account];
  }

  function setResult(address account, Result memory _result) external onlyRole(WRITER) {
    results[account] = _result;
  }
}
