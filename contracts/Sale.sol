// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Eligibility.sol";
import "./lib/ERC20Ownable.sol";

/**
 * @title Token sale.
 * @author Julien Schneider, Mathieu Bour
 * @notice Conduct a token sale in exchange for a stablecoin (STC), e.g. USDC.
 */
contract Sale is Ownable {
    using SafeERC20 for ERC20;
    using SafeERC20 for ERC20Ownable;

    /// @dev The DPS contract being sold.
    ERC20Ownable public DPS;

    /// @dev The stablecoin ERC20 contract.
    ERC20 public STC;

    // @dev The eligibility contract.
    Eligibility public eligibility;

    /// @dev How many cents costs a DPS (e.g., 40 means a single DPS token costs 0.40 STC).
    uint8 public rate;

    /// @dev How many DPS tokens were sold during the sale.
    uint256 public sold;

    /**
     * Token purchase event.
     * @param investor The investor address.
     * @param amountDPS Amount of DPS tokens purchased.
     */
    event Purchase(address indexed investor, uint256 amountDPS);

    /**
     * @param _DPS The DPS contract address.
     * @param _STC The ERC20 stablecoin contract address (e.g, USDT, USDC, etc.).
     * @param _eligibility The eligibility contract.
     * @param _rate The DPS/STC rate in STC cents.
     * @param _initialSold How many DPS tokens were already sold.
     */
    constructor(
        ERC20Ownable _DPS,
        ERC20 _STC,
        Eligibility _eligibility,
        uint8 _rate,
        uint256 _initialSold
    ) {
        require(address(_DPS) != address(0), "Sale: token is zero");
        require(address(_STC) != address(0), "Sale: stablecoin is zero");
        require(address(_eligibility) != address(0), "Sale: eligibility is zero");
        require(_rate > 0, "Sale: rate is not positive");

        DPS = _DPS;
        STC = _STC;
        eligibility = _eligibility;
        rate = _rate;
        sold = _initialSold;
    }

    /**
     * @notice Convert a stablecoin amount in DPS.
     * @dev Maximum possible working value is 210M DPS * 1e18 * 1e6 = 210e30
     * log2(210e30) ~= 107 => this should not overflow.
     */
    function convertSTCtoDPS(uint256 amountSTC) public view returns (uint256) {
        return (amountSTC * (10**DPS.decimals()) * 100) / rate / (10**STC.decimals());
    }

    /**
     * @notice Convert a DPS amount in stablecoin.
     */
    function convertDPStoSTC(uint256 amountDPS) public view returns (uint256) {
        return (amountDPS * (10**STC.decimals()) * rate) / 100 / (10**DPS.decimals());
    }

    /**
     * @notice Get the raised stablecoin amount.
     */
    function raised() external view returns (uint256) {
        return convertDPStoSTC(sold);
    }

    /**
     * @notice Get the remaining DPS tokens to sell.
     */
    function remaining() external view returns (uint256) {
        return DPS.balanceOf(address(this));
    }

    /**
     * @notice Validate that the account is allowed to buy DPS.
     * @dev Requirements:
     * - the account is not the sale owner.
     * - the account is eligible.
     */
    function _validate(address account, uint256 amountSTC) internal view {
        require(account != owner(), "Sale: investor is the sale owner");

        uint8 tier = eligibility.result(account).tier;

        require(tier > 0, "Sale: account is not eligible");

        uint256 investmentSTC = convertDPStoSTC(DPS.balanceOf(account)) + amountSTC;
        uint256 limitSTC = eligibility.limit(eligibility.result(account).tier) * (10**STC.decimals());

        if (limitSTC != 0) {
            // zero limit means that the tier has no restrictions
            require(investmentSTC <= limitSTC, "Sale: exceeds tier limit");
        }
    }

    /**
     * @notice Deliver the DPS to the account.
     * @dev Requirements:
     * - there are enough DPS remaining in the sale.
     */
    function _transferDPS(address account, uint256 amountDPS) internal {
        DPS.safeTransfer(account, amountDPS);
        sold += amountDPS;

        emit Purchase(account, amountDPS);
    }

    /**
     * @notice Buy DPS with stablecoins.
     * @param amountSTC The amount of stablecoin to invest.
     */
    function buyTokens(uint256 amountSTC) external {
        _validate(msg.sender, amountSTC);

        uint256 amountDPS = convertSTCtoDPS(amountSTC);
        require(DPS.balanceOf(address(this)) >= amountDPS, "Sale: no enough tokens remaining");

        STC.safeTransferFrom(msg.sender, owner(), amountSTC);
        _transferDPS(msg.sender, amountDPS);
    }

    /**
     * @notice Deliver tokens to an investor. Restricted to the sale OWNER.
     * @param amountSTC The amount of stablecoins invested.
     * @param account The investor address.
     */
    function deliverTokens(uint256 amountSTC, address account) external onlyOwner {
        _validate(account, amountSTC);

        uint256 amountDPS = convertSTCtoDPS(amountSTC);
        require(DPS.balanceOf(address(this)) >= amountDPS, "Sale: no enough tokens remaining");

        _transferDPS(account, amountDPS);
    }

    /**
     * @notice Close the sale by sending the remaining tokens back to the owner and then renouncing ownership.
     */
    function close() external onlyOwner {
        _transferDPS(DPS.owner(), DPS.balanceOf(address(this)));
        renounceOwnership();
    }
}
