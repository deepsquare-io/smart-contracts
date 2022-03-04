// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Eligibility.sol";
import "./DeepSquareToken.sol";

/**
 * @title Sale
 * @dev Initially based on the OpenZeppelin contract in v2.5.
 * This contract allows to conduct a sale which tokens are raised in exchange of stable coin (for example, USDT or
 * USDC).
 */
contract Sale is Context, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for DeepSquareToken;

    // The token being sold
    DeepSquareToken public token;

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
        DeepSquareToken _token,
        IERC20 _stableCoin,
        Eligibility _eligible,
        uint256 _rate
    ) {
        require(_rate > 0, "Crowdsale: rate is 0");
        require(address(_token) != address(0), "Crowdsale: token is the zero address");

        rate = _rate;
        eligibility = _eligible;
        token = _token;
        stableCoin = _stableCoin;
    }

    function remaining() external view returns (uint) {
        return token.balanceOf(address(this));
    }

    function buyTokens(uint256 _stableCoinAmount) external {
        // Validate the sender
        require(_msgSender() != owner(), "Sale: buyer is the sale owner");

        // calculate token amount to be created
        uint256 tokenAmount = _stableCoinAmount.mul(rate);
        require(token.balanceOf(address(this)) >= tokenAmount, "Sale: sale has ended");

        stableCoin.safeTransferFrom(_msgSender(), owner(), tokenAmount);
        token.safeTransfer(_msgSender(), tokenAmount);

        emit TokenPurchased(_msgSender(), tokenAmount);
    }

    function close() external onlyOwner {
        token.safeTransfer(token.owner(), token.balanceOf(address(this)));
        renounceOwnership();
    }
}
