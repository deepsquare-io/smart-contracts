// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Eligibility.sol";

/**
 * @title Token transfer.
 * @author Valentin Pollart for the DeepSquare Association.
 * @notice Conduct a token transfer.
 */
contract Transfer is Ownable{
    /// @notice The DPS token contract being sold. It must have an owner() function in order to let the sale be closed.
    IERC20Metadata public immutable DPS;

    /// @notice The stablecoin ERC20 contract.
    IERC20Metadata public immutable STC;

    // @notice The eligibility contract.
    IEligibility public immutable eligibility;

    /// @notice How many cents costs a DPS (e.g., 40 means a single DPS token costs 0.40 STC).
    uint8 public immutable rate;

    /**
     * Token purchase event.
     * @param investor The investor address.
     * @param amountDPS Amount of DPS tokens purchased.
     */
    event TransferEvent(address indexed investor, uint256 amountDPS);

    /**
     * @param _DPS The DPS contract address.
     * @param _STC The ERC20 stablecoin contract address (e.g, USDT, USDC, etc.).
     * @param _eligibility The eligibility contract.
     * @param _rate The DPS/STC rate in STC cents.
     */
    constructor(
        IERC20Metadata _DPS,
        IERC20Metadata _STC,
        Eligibility _eligibility,
        uint8 _rate
    ) {
        require(address(_DPS) != address(0), "Sale: token is zero");
        require(address(_STC) != address(0), "Sale: stablecoin is zero");
        require(address(_eligibility) != address(0), "Sale: eligibility is zero");
        require(_rate > 0, "Sale: rate is not positive");

        DPS = _DPS;
        STC = _STC;
        eligibility = _eligibility;
        rate = _rate;
    }

    /**
     * @notice Convert a DPS amount in stablecoin.
     * @dev Maximum possible working value is 210M DPS * 1e18 * 1e6 = 210e30.
     * Since log2(210e30) ~= 107,this cannot overflow an uint256.
     * @param amountDPS The amount in DPS.
     * @return The amount in stablecoin.
     */
    function convertDPStoSTC(uint256 amountDPS) public view returns (uint256) {
        return (amountDPS * (10**STC.decimals()) * rate) / 100 / (10**DPS.decimals());
    }

    /**
     * @notice Validate that the account is allowed to buy DPS.
     * @dev Requirements:
     * - the account is not the sale owner.
     * - the account is eligible.
     * @param account The account to check that should receive the DPS.
     * @param amountDPS The amount of DPS that will be tranferred.
     */
    function _validate(address account, uint256 amountDPS) internal {
        require(account != owner(), "Transfer: beneficiary is the sale owner");
        require(DPS.balanceOf(address(this)) >= amountDPS, "Transfer: no enough tokens remaining");

        (uint8 tier, uint256 limit) = eligibility.lookup(account);

        require(tier > 0, "Transfer: account is not eligible");

        uint256 investmentSTC = convertDPStoSTC(DPS.balanceOf(account) + amountDPS);
        uint256 limitSTC = limit * (10**STC.decimals());

        if (limitSTC != 0) {
            // zero limit means that the tier has no restrictions
            require(investmentSTC <= limitSTC, "Transfer: exceeds tier limit");
        }
    }

    /**
     * @notice Deliver the DPS to the account.
     * @dev Requirements:
     * - there are enough DPS remaining in the sale.
     * @param account The account that will receive the DPS.
     * @param amountDPS The amount of DPS to transfer.
     */
    function _transferDPS(address account, uint256 amountDPS) internal {
        DPS.transfer(account, amountDPS);

        emit TransferEvent(account, amountDPS);
    }

    /**
     * @notice Deliver DPS tokens to an investor. Restricted to the sale OWNER.
     * @param amountDPS The amount of DPS transferred, no minimum amount.
     * @param account The investor address.
     */
    function deliverDPS(uint256 amountDPS, address account) external onlyOwner {
        _validate(account, amountDPS);
        _transferDPS(account, amountDPS);
    }

    /**
     * @notice Close the sale by sending the remaining tokens back to the owner and then renouncing ownership.
     */
    function close() external onlyOwner {
        _transferDPS(owner(), DPS.balanceOf(address(this))); // Transfer all the DPS back to the owner
        renounceOwnership();
    }
}
