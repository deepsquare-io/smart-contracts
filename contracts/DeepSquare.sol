// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './lib/ERC20Ownable.sol';
import './lib/ERC20Security.sol';

/**
 * @title DeepSquare (DPS) ERC20 token
 * @author Julien Schneider, Mathieu Bour
 * @notice DeepSquare Token (DPS) contract which controls how the DPS tokens is managed.
 * @dev Since this a security token, transfers are restricted to the authorized accounts of the contract.
 */
contract DeepSquare is ERC20Ownable {
  /// @dev The security which controls the token transfers.
  ERC20Security security;

  /**
   * @notice Instantiate the contract.  The deployer is allowed to mint 210M DPS.
   */
  constructor() ERC20('DeepSquare', 'DPS') {
    _mint(msg.sender, 210 * 1e6 * 1e18); // 210,000,000 wei = 210 millions token with 18 decimals
  }

  /**
   * @notice Set the security contract. Restricted to the owner.
   */
  function setSecurity(ERC20Security newSecurity) external onlyOwner {
    security = newSecurity;
  }

  /**
   * @dev Forward the _beforeTokenTransfer hook to the DeepSquareSecurity which will validate the token transfer.
   * @param from The account from where the tokens will be taken.
   * @param to The account where the tokens will be sent.
   * @param amount The token amount.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override {
    if (msg.sender != owner()) {
      security.validateTokenTransfer(msg.sender, from, to, amount);
    }
  }
}
