// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DeepSquare.sol";
import "./Eligibility.sol";

contract Initializer is Ownable {
    DeepSquare public DPS;
    Eligibility public eligibility;

    constructor(DeepSquare _DPS, Eligibility _eligibility) {
        DPS = _DPS;
        eligibility = _eligibility;
    }

    function setResults(address[] memory accounts, Result[] memory batch) external onlyOwner {
        require(accounts.length > 0, "Eligibility: accounts has size 0");

        for (uint256 i = 0; i < accounts.length; i++) {
            eligibility.setResult(accounts[i], batch[i]);
        }
    }

    function airdrop(address[] memory recipients, uint256[] memory amounts) external onlyOwner returns (bool) {
        require(recipients.length != 0, "Initializer: recipient length is zero");
        require(recipients.length == amounts.length, "Initializer: arguments size mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(DPS.transfer(recipients[i], amounts[i]));
        }

        return true;
    }

    function destruct() external onlyOwner {
        address _owner = owner();
        DPS.transfer(_owner, DPS.balanceOf(address(this)));
        renounceOwnership();
        selfdestruct(payable(_owner));
    }
}
