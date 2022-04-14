// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract ReferralProgram is Ownable {
    IERC20Metadata public DPS;

    uint256 public limit;

    constructor(IERC20Metadata _DPS, uint256 _limit) {
        require(address(_DPS) != address(0), 'ReferralProgram: token is zero.');
        require(_limit > 0, 'ReferralProgram: Limit is lower or equal to zero.');

        DPS = _DPS;
        limit = _limit;
    }

    /**
     * @dev Deliver DPS to recipients.
     * @param referrers The referrers addresses.
     * @param referees A matrix of the referees.
     */
    function deliver(address[] memory referrers, address[][] memory referees) external onlyOwner {
        require(referrers.length == referees.length, 'ReferralProgram: referrers and referees lists have different lengths.');
        for (uint i = 0; i < referrers.length; i++) {
            address referrer = referrers[i];
            require(DPS.balanceOf(referrer) >= limit, 'ReferralProgram: referrer balance is lower than limit.');

            if (referees[i].length > 0) {
                uint256 gains = 0;
                for (uint j = 0; j < referees[i].length; j++) {
                    gains += DPS.balanceOf(referees[i][j]);
                }

                require(DPS.transfer(referrer, gains * 12 / 100));
            }
        }
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
