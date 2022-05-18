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
    /// @notice The DPS token contract.
    DeepSquare public DPS;

    /// @notice The SQR token contract.
    Square public SQR;

    // @notice The eligibility contract.
    IEligibility public eligibility;

    uint256 THRESHOLD = 25000 * 1e18;

    /**
     * Token purchase event.
     * @param investor The investor address.
     * @param amountDPS Amount of DPS tokens purchased.
     */
    event SwapSQRToDPS(address indexed investor, uint256 amountDPS);

    /**
     * Token purchase event.
     * @param investor The investor address.
     * @param amountSQR Amount of SQR tokens purchased.
     */
    event SwapDPSToSQR(address indexed investor, uint256 amountSQR);

    /**
     * @param _DPS The DPS contract address.
     * @param _SQR The ERC20 stablecoin contract address (e.g, USDT, USDC, etc.).
     * @param _eligibility The eligibility contract.
     */
    constructor(
        DeepSquare _DPS,
        Square _SQR,
        IEligibility _eligibility
    ) {
        require(address(_DPS) != address(0), "DeepSquareBridge: token is zero");
        require(address(_SQR) != address(0), "DeepSquareBridge: stablecoin is zero");
        require(address(_eligibility) != address(0), "DeepSquareBridge: eligibility is zero");

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

        emit SwapDPSToSQR(msg.sender, amount);
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

        (uint256 tier, uint256 limit) = eligibility.lookup(msg.sender);
        require(tier != 0 && (amount <= limit || limit == 0), "Bridge: amount exceeds permitted limit");

        SQR.transferFrom(msg.sender, address(this), amount);
        DPS.transfer(msg.sender, amount);

        emit SwapSQRToDPS(msg.sender, amount);
    }
}
