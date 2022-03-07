// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * @title DeepSquare (DPS) ERC20 token
 * @author Julien Schneider, Mathieu Bour
 * @notice DeepSquare Token (DPS) contract which controls how the DPS tokens is managed.
 * @dev Since this a security token, transfers are restricted to the authorized accounts of the contract.
 */
contract DeepSquare is ERC20, AccessControl {
  /// @dev The spender is allow to send his tokens to someone else, but not to move someone else DPS tokens
  bytes32 public constant SPENDER = keccak256('SPENDER');

  /**
   * @dev Instantiate the contract. The deployer account is automatically granted the DEFAULT_ADMIN_ROLE and SPENDER roles.
   */
  constructor() ERC20('DeepSquare', 'DPS') {
    _mint(msg.sender, 210 * 1e6 * 1e18); // 210,000,000 wei = 210 millions token with 18 decimals

    // Configure the roles
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(SPENDER, msg.sender);
  }

  /**
   * @dev Restrict the DPS transfers to accounts with SPENDER role.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override onlyRole(SPENDER) {}
}
