// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author DeepSquare Association
 * @dev DeepSquare Token (DPS)
 * Since this a security token, transfers are restricted to the owner of the contract.
 */
contract DeepSquareToken is ERC20, Ownable {
    constructor() ERC20("DeepSquare", "DPS") {
        _mint(msg.sender, 210 * 1e6 * 1e18);
        // 210,000,000 wei = 210 millions token with 18 decimals
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     * Returns a boolean value indicating whether the operation succeeded.
     * Emits a {Transfer} event.
     * Restricted to the owner.
     */
    function transfer(address to, uint256 amount) public override onlyOwner returns (bool) {
        return super.transfer(to, amount);
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Restricted to the owner.
     * Completely bypass the allowance checks.
     */
    function transferFrom(address from, address to, uint256 amount) public override onlyOwner returns (bool) {
        _transfer(from, to, amount);
        return true;
    }
}
