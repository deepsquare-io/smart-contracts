// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

struct Lock {
    uint256 value;
    uint256 release; // The release date in seconds since the epoch
}

contract Vesting is Ownable {
    /**
     * @dev The vested token.
     */
    IERC20Metadata public token;

    /**
     * @dev The vesting locks, mapped by account addresses.
     * There is no guarantee that the locks are ordered by release date time.
     */
    mapping(address => Lock[]) private locks;

    constructor(IERC20Metadata _token) {
        token = _token;
    }

    function vest(address investor, Lock memory lock) external onlyOwner {
        locks[investor].push(lock);
        token.transfer(investor, lock.value);
    }

    function available(uint256 currentDate) public view returns (uint256) {
        return token.balanceOf(msg.sender) - locked(currentDate);
        // potentially negative???
    }

    function locked(uint256 currentDate) public view returns (uint256) {
        uint256 sum = 0;

        for (uint256 i = 0; i < locks[msg.sender].length; i++) {
            if (locks[msg.sender][i].release < currentDate) continue;

            sum += locks[msg.sender][i].value;
        }

        return sum;
    }
}
