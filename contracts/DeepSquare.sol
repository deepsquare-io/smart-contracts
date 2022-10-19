// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/ISecurity.sol";

/**
 * @title DeepSquare DPS token.
 * @author Mathieu Bour, Julien Schneider, Charly Mancel, Valentin Pollart and Clarisse Tarrou for the DeepSquare Association.
 * @notice The DPS token is the DeepSquare ERC-20 security token.
 * @dev Since this a security token, transfers are restricted to the authorized accounts of the contract.
 */
contract DeepSquare is ERC20, Ownable {
    /// @dev The security which controls the token transfers.
    ISecurity public security;

    /**
     * @param initialSecurity The initial security contract.
     */
    constructor(ISecurity initialSecurity) ERC20("DeepSquare", "DPS") {
        security = initialSecurity;
        _mint(msg.sender, 210e6 * 1e18);
        // 210,000,000 wei = 210 millions token with 18 decimals
    }

    /**
     * @notice Set the security contract which manages the token transfer restrictions.
     * @param newSecurity The new security contract.
     */
    function setSecurity(ISecurity newSecurity) external onlyOwner {
        security = newSecurity;
    }

    /**
     * @dev Forward the _beforeTokenTransfer hook to the DeepSquareSecurity contract which manages the token transfer restrictions.
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
