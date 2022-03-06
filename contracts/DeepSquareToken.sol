// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @author DeepSquare Association
 * @dev DeepSquare Token (DPS)
 * Since this a security token, transfers are restricted to the owner of the contract.
 */
contract DeepSquareToken is ERC20, Ownable, AccessControl {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    bytes32 public constant SPENDER = keccak256("SPENDER");

    constructor() ERC20("DeepSquare", "DPS") {
        _mint(msg.sender, 210 * 1e6 * 1e18); // 210,000,000 wei = 210 millions token with 18 decimals
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SPENDER, msg.sender);
    }

    function addSpender(address account) external {
        grantRole(SPENDER, account);
    }

    function removeSpender(address account) external  {
        revokeRole(SPENDER, account);
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     * Returns a boolean value indicating whether the operation succeeded.
     * Emits a {Transfer} event.
     * Restricted to the owner.
     */
    function transfer(address to, uint256 amount) public override onlyRole(SPENDER) returns (bool) {
        return super.transfer(to, amount);
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Restricted to the owner.
     * Completely bypass the allowance checks.
     */
    function transferFrom(address from, address to, uint256 amount) public override onlyRole(SPENDER) returns (bool) {
        _transfer(from, to, amount);
        return true;
    }
}
