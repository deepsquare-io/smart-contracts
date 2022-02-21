// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// TODO remove console.sol later on

import "hardhat/console.sol";

contract DeepSquareToken is ERC20, Ownable {
    // whitelist allowed to transfer, mint, burn
    mapping(address => bool) public transferWhitelist;

    constructor() ERC20("DeepSquareToken", "DPS") {
        transferWhitelist[msg.sender] = true;
        _mint(msg.sender, 210e24); // 210e6e18 = 210 millions token
    }

    function grantAccess(address _address) external onlyOwner {
        transferWhitelist[_address] = true;
    }

    function revokeAccess(address _address) external onlyOwner {
        require(
            _address != owner(),
            "DeepSquareToken: owner cannot be revoked"
        );
        transferWhitelist[_address] = false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override {
        require(
            transferWhitelist[msg.sender] == true,
            "DeepSquareToken: user not allowed to transfer"
        );
    }
}
