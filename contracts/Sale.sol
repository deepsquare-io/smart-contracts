// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Eligibility.sol";

/**
 * @title Sale
 * @dev Initially based on the OpenZeppelin contract in v2.5.
 * This contract allows to conduct a sale which tokens are raised in exchange of stable coin (for example, USDT or
 * USDC).
 */
contract Sale is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // The token being sold
  IERC20 public token;

  // The stable coin used
  IERC20 public stableCoin;

  // How many token units a buyer gets per stableCoin unit. Watch out for the decimals difference.
  // So, if you are using a rate of 1 with a USDT token with 6 decimals, and a ERC20 token with 18 decimals
  // 10^-6 USDT will give you will give you 10^-18 Tokens
  // -> 1 USDT = 10^-12 tokens.
  uint256 public rate;

  // The eligibility contract
  Eligibility public eligibility;

  uint256 public sold;

  // Amount of stableCoins raised
  uint256 public sbcRaised;

  /**
   * Event for token purchase logging
   * @param _purchaser who paid for the tokens
     * @param _amount amount of tokens purchased
     */
  event TokenPurchased(
    address indexed _purchaser,
    uint256 _amount
  );

  /**
   */
  constructor(
    IERC20 _token,
    IERC20 _stableCoin,
    Eligibility _eligible,
    uint256 _rate
  ) {
    require(_rate > 0, "Crowdsale: rate is 0");
    require(address(_token) != address(0), "Crowdsale: token is the zero address");

    token = _token;
    stableCoin = _stableCoin;
    eligibility = _eligible;
    rate = _rate;
  }

  function remaining() external view returns (uint) {
    return token.balanceOf(address(this));
  }

  /**
   * @dev Convert an amount of stable coin in DPS.
   */
  function convert(uint amountSTC) public view returns (uint) {
    return amountSTC * rate;
  }

  /**
   * @dev Exchange stable coin with DPS tokens.
   * @param amountSTC The amount of stable coin to invest.
   */
  function buyTokens(uint256 amountSTC) external {
    address _funder = msg.sender;
    address _owner = owner();

    // Validate the sender
    require(_funder != _owner, "Sale: buyer is the sale owner");

    // calculate token amount to be created
    uint256 amountDPS = amountSTC.mul(rate);
    require(token.balanceOf(address(this)) >= amountDPS, "Sale: sale has ended");

    stableCoin.safeTransferFrom(_funder, _owner, amountSTC);
    token.safeTransfer(_funder, amountDPS);
    emit TokenPurchased(_funder, amountDPS);
  }
}
