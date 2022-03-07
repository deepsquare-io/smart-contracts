// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './SpenderSecurity.sol';

/**
 * @title DeepSquare (DPS) ERC20 token
 * @author Julien Schneider, Mathieu Bour
 * @notice DeepSquare Token (DPS) contract which controls how the DPS tokens is managed.
 * @dev Since this a security token, transfers are restricted to the authorized accounts of the contract.
 */
contract DeepSquare is ERC20, Ownable {
  /// @dev The security which controls the token transfers.
  DeepSquareSecurity security;

  /**
   * @dev Instantiate the contract. The deployer account is automatically granted the DEFAULT_ADMIN_ROLE and SPENDER roles.
   */
  constructor() ERC20('DeepSquare', 'DPS') {
    _mint(msg.sender, 210 * 1e6 * 1e18); // 210,000,000 wei = 210 millions token with 18 decimals
  }

  /**
   * @dev Set the security contract.
   */
  function setSecurity(DeepSquareSecurity newSecurity) external onlyOwner {
    security = newSecurity;
  }

  /**
   * @dev Forward the _beforeTokenTransfer hook to the DeepSquareSecurity.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override {
    security.validateTokenTransfer(msg.sender, from, to, amount);
  }
}
