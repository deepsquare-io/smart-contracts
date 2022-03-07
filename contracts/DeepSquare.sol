// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title DeepSquare (DPS) ERC20 token
 * @author Mathieu Bour
 * @notice DeepSquare Token (DPS) contract which controls how the DPS tokens is managed.
 * @dev Since this a security token, transfers are restricted to the authorized accounts of the contract.
 */
contract DeepSquare is ERC20, AccessControl {
    /// @dev The owner is allowed to completely manage the DPS tokens
    bytes32 public constant OWNER = keccak256("OWNER");
    /// @dev The spender is allow to send his tokens to someone else, but not to move someone else DPS tokens
    bytes32 public constant SPENDER = keccak256("SPENDER");

    /**
     * @dev Instantiate the contract. The deployer account is automatically granted the OWNER and SPENDER roles.
     */
    constructor() ERC20("DeepSquare", "DPS") {
        _mint(msg.sender, 210 * 1e6 * 1e18); // 210,000,000 wei = 210 millions token with 18 decimals

        // Configure the roles
        _setRoleAdmin(SPENDER, OWNER);
        _grantRole(OWNER, msg.sender);
        _grantRole(SPENDER, msg.sender);
    }

    /**
     * @inheritdoc ERC20
     * @dev Restricted to SPENDER accounts.
     */
    function transfer(address to, uint256 amount) public override onlyRole(SPENDER) returns (bool) {
        return super.transfer(to, amount);
    }

    /**
     * @inheritdoc ERC20
     * @dev Restricted to the OWNERS accounts. Allowance is bypassed.
     */
    function transferFrom(address from, address to, uint256 amount) public override onlyRole(OWNER) returns (bool) {
        _transfer(from, to, amount);
        return true;
    }
}
