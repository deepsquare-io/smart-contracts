// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeepSquareToken is ERC20, Ownable {
    constructor() ERC20("DeepSquareToken", "DPS") {
        _mint(msg.sender, 210e24); // 210e6e18 = 210 millions token
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override onlyOwner {}

}
