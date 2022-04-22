// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";


contract BallotTagManager is Ownable {
    string[] public tags;

    function getTags() external view returns(string[] memory) {
        return tags;
    }

    function addTag(string memory name) external onlyOwner {
        tags.push(name);
    }
}
