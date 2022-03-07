// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './Eligibility.sol';
import './lib/ERC20Ownable.sol';

/**
 * @title Sale
 * @author Julien Schneider, Mathieu Bour
 * @notice Allows to conduct a sale which tokens are raised in exchange of stable coin (for example, USDT or
 * USDC).
 */
contract Sale is Ownable {
  using SafeERC20 for ERC20;
  using SafeERC20 for ERC20Ownable;

  /// @dev The DPS contract being sold.
  ERC20Ownable public DPS;

  /// @dev The stable coin ERC20 contract.
  ERC20 public STC;

  // @dev The eligibility contract
  Eligibility public eligibility;

  /// @dev How many cents costs a DPS (for example, 40 means that a DPS costs 0.40 STC).
  uint8 public rate;

  /// @dev How much DPS token were sold.
  uint256 public sold;

  /**
   * Event for token purchase logging
   * @param investor who paid for the tokens
   * @param amountDPS amount of DPS tokens purchased
   */
  event Purchase(address indexed investor, uint256 amountDPS);

  /**
   * @param _DPS The DPS contract address.
   * @param _STC The stable coin ERC20 contract address (USDT, USDC, etc.).
   * @param _eligibility The eligibility contract.
   * @param _rate The DPS/STC rate in STC cents.
   * @param _initialSold How much DPS were already sold.
   */
  constructor(
    ERC20Ownable _DPS,
    ERC20 _STC,
    Eligibility _eligibility,
    uint8 _rate,
    uint256 _initialSold
  ) {
    require(address(_DPS) != address(0), 'Sale: token is the zero address');
    require(address(_STC) != address(0), 'Sale: stable coin is the zero address');
    require(_rate > 0, 'Sale: rate is 0');

    DPS = _DPS;
    STC = _STC;
    eligibility = _eligibility;
    rate = _rate;
    sold = _initialSold;
  }

  /**
   * @notice Convert an amount of stable coin in DPS.
   * @dev Maximum possible working value is 210M DPS * 1e18 * 1e6 = 210e30
   * log2(210e30) ~= 107 => this should not overflow.
   */
  function convertSTCtoDPS(uint256 amountSTC) public view returns (uint256) {
    return (amountSTC * (10**DPS.decimals()) * 100) / rate / (10**STC.decimals());
  }

  /**
   * @notice Convert an amount of DPS in stable coin.
   */
  function convertDPStoSTC(uint256 amountDPS) public view returns (uint256) {
    return (amountDPS * (10**STC.decimals()) * rate) / 100 / (10**DPS.decimals());
  }

  /**
   * @notice Get the raised stable coin amount.
   */
  function raised() external view returns (uint256) {
    return convertDPStoSTC(sold);
  }

  /**
   * @notice The remaining DPS in the sale.
   */
  function remaining() external view returns (uint256) {
    return DPS.balanceOf(address(this));
  }

  /**
   * @notice Validate that the account is allowed to buy DPS.
   * @dev Requirements:
   * - the account is not the sale owner
   * - the account is eligible
   */
  function _validate(address account, uint256 amountSTC) internal view {
    require(account != owner(), 'Sale: buyer is the sale owner');

    uint256 investmentSTC = convertDPStoSTC(DPS.balanceOf(account) + amountSTC);
    uint256 limitSTC = eligibility.limit(eligibility.result(account).tier);
    require(investmentSTC <= limitSTC, 'Sale: investment exceeds tier limit');
  }

  /**
   * @notice Deliver the DPS to the account
   * @dev Requirements:
   * - there are enough DPS remaining in the sale
   */
  function _transferDPS(address account, uint256 amountDPS) internal {
    DPS.safeTransfer(account, amountDPS);
    sold += amountDPS;

    emit Purchase(account, amountDPS);
  }

  /**
   * @notice Exchange stable coin with DPS tokens.
   * @param amountSTC The amount of **stable coin** to invest.
   */
  function buyTokens(uint256 amountSTC) external {
    _validate(msg.sender, amountSTC);

    uint256 amountDPS = convertSTCtoDPS(amountSTC);
    require(DPS.balanceOf(address(this)) >= amountDPS, 'Sale: no enough tokens remaining');

    STC.safeTransferFrom(msg.sender, owner(), amountSTC);
    _transferDPS(msg.sender, amountDPS);
  }

  /**
   * @notice Deliver tokens to a investor. Restricted to the sale OWNER.
   * @param amountSTC The amount of **stable coin** to invested by the investor.
   * @param account The investor address.
   */
  function deliverTokens(uint256 amountSTC, address account) external onlyOwner {
    _validate(account, amountSTC);

    uint256 amountDPS = convertSTCtoDPS(amountSTC);
    require(DPS.balanceOf(address(this)) >= amountDPS, 'Sale: no enough tokens remaining');

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
