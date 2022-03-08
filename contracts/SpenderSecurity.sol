// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./lib/ERC20Security.sol";

/**
 * @title SpenderSecurity
 * @author Mathieu Bour
 * @notice Only accounts with the SPENDER role can transfer their DPS.
 */
contract SpenderSecurity is ERC20Security, AccessControl {
    /// @dev The spender is allow to transfer his own tokens, but cannot move someone else's DPS tokens.
    bytes32 public constant SPENDER = keccak256("SPENDER");

    constructor() ERC20Security() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SPENDER, msg.sender);
    }

    /**
     * @notice Check if the DPS transfer should be authorized.
     * @param sender The account which triggered the transfer.
     * @param from The account from where the tokens will be taken.
     * @dev Requirements:
     * - the sender must have the SPENDER role which the contract owner has.
     * - the senders can only transfer their own tokens.
     */
    function validateTokenTransfer(
        address sender,
        address from,
        address, // to, might be unused in another security contract in the future
        uint256 // amount, might be unused in another security contract in the future
    ) public view override {
        // spenders are allowed to call transfer(to, amount)
        _checkRole(SPENDER, sender);
        // solhint-disable-next-line reason-string
        require(sender == from, "SpenderSecurity: cannot move tokens from another account");
    }
}
