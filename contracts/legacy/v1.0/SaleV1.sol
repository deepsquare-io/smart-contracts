// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../../Eligibility.sol";

/**
 * @title Token sale.
 * @author Mathieu Bour, Julien Schneider, Charly Mancel, Valentin Pollart and Clarisse Tarrou for the DeepSquare Association.
 * @notice Conduct a token sale in exchange for a stablecoin (STC), e.g. USDC.
 */
contract SaleV1 is Ownable {
    /// @notice The DPS token contract being sold. It must have an owner() function in order to let the sale be closed.
    IERC20Metadata public immutable DPS;

    /// @notice The stablecoin ERC20 contract.
    IERC20Metadata public immutable STC;

    // @notice The eligibility contract.
    IEligibility public immutable eligibility;

    /// @notice How many cents costs a DPS (e.g., 40 means a single DPS token costs 0.40 STC).
    uint8 public immutable rate;

    /// @notice The minimum DPS purchase amount in stablecoin.
    uint256 public immutable minimumPurchaseSTC;

    /// @notice How many DPS tokens were sold during the sale.
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
        IERC20Metadata _DPS,
        IERC20Metadata _STC,
        Eligibility _eligibility,
        uint8 _rate,
        uint256 _minimumPurchaseSTC,
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
        minimumPurchaseSTC = _minimumPurchaseSTC;
        sold = _initialSold;
    }

    /**
     * @notice Convert a stablecoin amount in DPS.
     * @dev Maximum possible working value is 210M DPS * 1e18 * 1e6 = 210e30.
     * Since log2(210e30) ~= 107, this cannot overflow an uint256.
     */
    function convertSTCtoDPS(uint256 amountSTC) public view returns (uint256) {
        return (amountSTC * (10**DPS.decimals()) * 100) / rate / (10**STC.decimals());
    }

    /**
     * @notice Convert a DPS amount in stablecoin.
     * @dev Maximum possible working value is 210M DPS * 1e18 * 1e6 = 210e30.
     * Since log2(210e30) ~= 107,this cannot overflow an uint256.
     * @param amountDPS The amount in DPS.
     */
    function convertDPStoSTC(uint256 amountDPS) public view returns (uint256) {
        return (amountDPS * (10**STC.decimals()) * rate) / 100 / (10**DPS.decimals());
    }

    /**
     * @notice Get the remaining DPS tokens to sell.
     * @return The amount of DPS remaining in the sale.
     */
    function remaining() external view returns (uint256) {
        return DPS.balanceOf(address(this));
    }

    /**
     * @notice Get the raised stablecoin amount.
     * @return The amount of stable coin raised in the sale.
     */
    function raised() external view returns (uint256) {
        return convertDPStoSTC(sold);
    }

    /**
     * @notice Validate that the account is allowed to buy DPS.
     * @dev Requirements:
     * - the account is not the sale owner.
     * - the account is eligible.
     * @param account The account to check that should receive the DPS.
     * @param amountSTC The amount of stablecoin that will be used to purchase DPS.
     * @return The amount of DPS that should be transferred.
     */
    function _validate(address account, uint256 amountSTC) internal returns (uint256) {
        require(account != owner(), "Sale: investor is the sale owner");

        (uint8 tier, uint256 limit) = eligibility.lookup(account);

        require(tier > 0, "Sale: account is not eligible");

        uint256 investmentSTC = convertDPStoSTC(DPS.balanceOf(account)) + amountSTC;
        uint256 limitSTC = limit * (10**STC.decimals());

        if (limitSTC != 0) {
            // zero limit means that the tier has no restrictions
            require(investmentSTC <= limitSTC, "Sale: exceeds tier limit");
        }

        uint256 amountDPS = convertSTCtoDPS(amountSTC);
        require(DPS.balanceOf(address(this)) >= amountDPS, "Sale: no enough tokens remaining");

        return amountDPS;
    }

    /**
     * @notice Deliver the DPS to the account.
     * @dev Requirements:
     * - there are enough DPS remaining in the sale.
     * @param account The account that will receive the DPS.
     * @param amountDPS The amount of DPS to transfer.
     */
    function _transferDPS(address account, uint256 amountDPS) internal {
        sold += amountDPS;
        DPS.transfer(account, amountDPS);

        emit Purchase(account, amountDPS);
    }

    /**
     * @notice Buy DPS with stablecoins.
     * @param amountSTC The amount of stablecoin to invest.
     */
    function purchaseDPS(uint256 amountSTC) external {
        require(amountSTC >= minimumPurchaseSTC, "Sale: amount lower than minimum");
        uint256 amountDPS = _validate(msg.sender, amountSTC);

        STC.transferFrom(msg.sender, owner(), amountSTC);
        _transferDPS(msg.sender, amountDPS);
    }

    /**
     * @notice Deliver DPS tokens to an investor. Restricted to the sale OWNER.
     * @param amountSTC The amount of stablecoins invested, no minimum amount.
     * @param account The investor address.
     */
    function deliverDPS(uint256 amountSTC, address account) external onlyOwner {
        uint256 amountDPS = _validate(account, amountSTC);
        _transferDPS(account, amountDPS);
    }

    /**
     * @notice Close the sale by sending the remaining tokens back to the owner and then renouncing ownership.
     */
    function close() external onlyOwner {
        // Call the DPS owner() function
        (bool success, bytes memory data) = address(DPS).staticcall(abi.encodeWithSignature("owner()"));
        require(success, "Sale: unable to determine owner");
        address owner = abi.decode(data, (address));

        _transferDPS(owner, DPS.balanceOf(address(this)));
        renounceOwnership();
    }
}
