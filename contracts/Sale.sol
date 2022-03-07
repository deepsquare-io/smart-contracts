// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Eligibility.sol";

/**
 * @title Sale
 * @dev Initially based on the OpenZeppelin contract in v2.5.
 * This contract allows to conduct a sale which tokens are raised in exchange of stable coin (for example, USDT or
 * USDC).
 */
contract Sale is Ownable {
  using SafeERC20 for ERC20;

  /// @dev The DPS contract being sold.
  ERC20 public DPS;

  /// @dev The stable coin ERC contract.
  ERC20 public STC;

  // @dev The eligibility contract
  Eligibility public eligibility;

  /// @dev How many cents costs a DPS (for example, 40 means that a DPS costs 0.40 STC).
  uint8 public rate;

  /// @dev How much DPS token were sold.
  uint256 public sold;

  /// @dev How much STC were raised.
  uint256 public raised;


  /**
   * Event for token purchase logging
   * @param funder who paid for the tokens
   * @param amountDPS amount of DPS tokens purchased
   */
  event Purchase(
    address indexed funder,
    uint256 amountDPS
  );

  /**
   * @param _DPS The DPS contract address.
   * @param _STC The stable coin ERC20 contract address (USDT, USDC, etc.).
   * @param _eligibility The eligibility contract.
   * @param _rate The DPS/STC rate in STC cents.
   */
  constructor(
    ERC20 _DPS,
    ERC20 _STC,
    Eligibility _eligibility,
    uint8 _rate
  ) {
    require(address(_DPS) != address(0), "Sale: token is the zero address");
    require(address(_STC) != address(0), "Sale: stable coin is the zero address");
    require(_rate > 0, "Sale: rate is 0");

    DPS = _DPS;
    STC = _STC;
    eligibility = _eligibility;
    rate = _rate;
  }

  function remaining() external view returns (uint) {
    return DPS.balanceOf(address(this));
  }

  /**
   * @dev Convert an amount of stable coin in DPS.
   */
  function convertSTCtoDPS(uint amountSTC) public view returns (uint) {
    return amountSTC * (10 ** DPS.decimals()) * 100 / rate / (10 ** STC.decimals());
  }

  /**
   * @dev Convert an amount of DPS in stable coin.
   */
  function convertDPStoSTC(uint amountDPS) public view returns (uint) {
    return amountDPS * (10 ** STC.decimals()) * rate / 100 / (10 ** DPS.decimals());
  }

  /**
   * @dev Exchange stable coin with DPS tokens.
   * @param amountSTC The amount of stable coin to invest.
   */
  function buyTokens(uint256 amountSTC) external {
    address _funder = msg.sender;
    address _owner = owner();
    uint256 amountDPS = convertSTCtoDPS(amountSTC);

    // Validate the sender
    require(_funder != _owner, "Sale: buyer is the sale owner");

    // Validate the KYC limits
    // require(token.balanceOf(_funder) + )

    // Validate that we can deliver enough tokens
    require(DPS.balanceOf(address(this)) >= amountDPS, "Sale: no enough tokens remaining");

    STC.safeTransferFrom(_funder, _owner, amountSTC);
    DPS.safeTransfer(_funder, amountDPS);
    sold += amountDPS;
    raised += amountSTC;

    emit Purchase(_funder, amountDPS);
  }
}
