// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeepSquareToken is ERC20, Ownable {
    // whitelist allowed to transfer, mint, burn
    mapping(address => bool) public allowList;

    constructor() ERC20("DeepSquareToken", "DPS") {
        allowList[msg.sender] = true;
        _mint(msg.sender, 210e24); // 210e6e18 = 210 millions token with 18 decimals
    }

    modifier onlyAllowList() {
        require(
            allowList[msg.sender] == true,
            "DeepSquareToken: user not in allowList"
        );
        _;
    }

    function grantAccess(address _address) external onlyOwner {
        // TODO only owner or onlyAllowList
        allowList[_address] = true;
    }

    function revokeAccess(address _address) external {
        require(
            _address != owner(),
            "DeepSquareToken: owner cannot be revoked"
        );
        allowList[_address] = false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override onlyAllowList {}
}
