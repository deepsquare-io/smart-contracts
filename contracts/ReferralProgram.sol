// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract ReferralProgram is Ownable {
    IERC20Metadata public DPS;

    uint256 public limit;

    constructor(IERC20Metadata _DPS, uint256 _limit) {
        require(address(_DPS) != address(0), "ReferralProgram: token is zero");
        require(limit > 0, 'ReferralProgram: Limit is lower or equal to zero.');

        DPS = _DPS;
        limit = _limit;
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
     * @dev Calculates the referral gains.
     * @param referrer Address of the referrer.
     * @param referees List of the addresses of the referees.
     */
    function calculateGains(address referrer, address[] memory referees) external onlyOwner returns (uint256) {
        require(referees.length != 0);

        uint256 gains = 0;
        for (uint i = 0; i < referees.length; i++) {
            gains += DPS.balanceOf(referees[i]) * 12 / 100;
        }

        return gains;
    }

    function verifyBeneficiary(address beneficiary) external {
        require(beneficiary != address(0));
        require(DPS.balanceOf(beneficiary) < limit);
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
