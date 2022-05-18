// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Square is ERC20, Ownable {
    constructor() ERC20("Square", "SQR") {
        _mint(msg.sender, 210e6 * 1e18);
    }
}
