// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DeepSquare.sol";
import "./interfaces/IEligibility.sol";
import "./Square.sol";

/**
 * @title Bridge
 * @notice Allow accounts to swap DPS to SQR and vice-versa.
 */
contract Bridge is Ownable {
    DeepSquare public DPS;
    Square public SQR;
    IEligibility public eligibility;
    uint256 THRESHOLD = 25000 * 1e18;

    constructor(
        DeepSquare _DPS,
        Square _SQR,
        IEligibility _eligibility
    ) {
        DPS = _DPS;
        SQR = _SQR;
        eligibility = _eligibility;
    }

    /**
     * @notice Replace the eligibility contract.
     */
    function setEligibility(IEligibility newEligibility) external onlyOwner {
        eligibility = newEligibility;
    }

    /**
     * @notice Swap DPS to SQR. No conditions, except the the account must have enough DPS.
     */
    function swapDPStoSQR(uint256 amount) external {
        DPS.transferFrom(msg.sender, address(this), amount);
        SQR.transfer(msg.sender, amount);
    }

    /**
     * @notice Swap SQR to DPS. Subject to governance restrictions.
     * @dev Requirements:
     * - account DPS and SQR balances must be greater the THRESHOLD.
     * - amount should not exceed permitted limit by Eligibility contract
     */
    function swapSQRtoDPS(uint256 amount) external {
        require(
            DPS.balanceOf(msg.sender) + SQR.balanceOf(msg.sender) >= THRESHOLD,
            "Bridge: total balances are not below minimum"
        );

        (, uint256 limit) = eligibility.lookup(msg.sender);
        require(amount <= limit, "Bridge: amount exceeds permitted limit");

        SQR.transferFrom(msg.sender, address(this), amount);
        DPS.transfer(msg.sender, amount);
    }
}
