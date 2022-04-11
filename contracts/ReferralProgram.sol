// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract ReferralProgram is Ownable {
    IERC20Metadata public DPS;

    constructor(IERC20Metadata _DPS) {
        DPS = _DPS;
    }

    /**
     * @dev Deliver DPS to recipients.
     * @param recipients The recipient addresses.
     * @param amounts The associated amounts.
     */
    function deliver(address[] memory recipients, uint256[] memory amounts) external onlyOwner returns (bool) {
        require(recipients.length != 0, "ReferralProgram: recipient length is zero");
        require(recipients.length == amounts.length, "ReferralProgram: arguments size mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(DPS.transfer(recipients[i], amounts[i]));
        }

        return true;
    }

    /**
     * @dev Destroy this contract after the referral program.
     */
    function destruct() external onlyOwner {
        address _owner = owner();
        DPS.transfer(_owner, DPS.balanceOf(address(this)));
        renounceOwnership();
        selfdestruct(payable(_owner));
    }
}
