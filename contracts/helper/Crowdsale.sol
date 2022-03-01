// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
// import "./ReentrancyGuard.sol";

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conforms
 * the base architecture for crowdsales. It is *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
// TODO contract Crowdsale is Context, ReentrancyGuard {
contract Crowdsale is Context, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // The token being sold
    IERC20 public token;

    // The stablecoin used for exchange
    IERC20 public stableCoin;

    // How many token units a buyer gets per stableCoin unit. Watch out for the decimals difference.
    // So, if you are using a rate of 1 with a USDT token with 6 decimals, and a ERC20 token with 18 decimals
    // 10^-6 USDT will give you will give you 10^-18 Tokens
    // -> 1 USDT = 10^-12 tokens.
    uint256 public rate;

    // Amount of stableCoins raised
    uint256 public sbcRaised;

    /**
     * Event for token purchase logging
     * @param _purchaser who paid for the tokens
     * @param _beneficiary who got the tokens
     * @param _value stableCoins paid for purchase
     * @param _amount amount of tokens purchased
     */
    event TokensPurchased(
        address indexed _purchaser,
        address indexed _beneficiary,
        uint256 _value,
        uint256 _amount
    );

    /**
     * @param _rate Number of token units a buyer gets per stableCoin
     * @dev The rate is the conversion between the smallest and indivisible stableCoin unit 
     * and the smallest and indivisible token unit.
     * So, if you are using a rate of 1 with a USDT token with 6 decimals, and a ERC20 token with 18 decimals
     * 10^-6 USDT will give you will give you 10^-18 Tokens
     * -> 1 USDT = 10^-12 tokens.
     * @param _token Address of the token being sold
     */
    constructor(
        uint256 _rate,
        IERC20 _token,
        IERC20 _stableCoin
    ) {
        require(_rate > 0, "Crowdsale: rate is 0");
        require(
            address(_token) != address(0),
            "Crowdsale: token is the zero address"
        );

        rate = _rate;
        token = _token;
        stableCoin = _stableCoin;
    }

    /**
     * @dev fallback function ***DO NOT OVERRIDE***
     * Note that other contracts will transfer funds with a base gas stipend
     * of 2300, which is not enough to call buyTokens. Consider calling
     * buyTokens directly when purchasing tokens from a contract.
     */
    // TODO Julien: warning, it was originally a fallback function, but I've change it as receive: CHECK
    /*
    receive () external payable {
        buyTokens(_msgSender());
    }
*/


    /**
     * @dev low level token purchase ***DO NOT OVERRIDE***
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function. TODO
     * @param _beneficiary Recipient of the token purchase
     */
    // TODO WHATCHOUT there was nonReentrant originally
    // TODO original : function buyTokens(address beneficiary) public nonReentrant payable {
    // TODO julien: why is there a beneficiary ? Cant the beneficiary be msg.sender ?
    function buyTokens(address _beneficiary, uint256 _sbcAmount)
        public
        payable
    {
        _preValidatePurchase(_beneficiary, _sbcAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(_sbcAmount);

        // update state
        sbcRaised = sbcRaised.add(_sbcAmount);

        _processPurchase(_beneficiary, tokens);
        emit TokensPurchased(_msgSender(), _beneficiary, _sbcAmount, tokens);

        _updatePurchasingState(_beneficiary, _sbcAmount);

        _forwardFunds(_beneficiary, _sbcAmount);
        _postValidatePurchase(_beneficiary, _sbcAmount);
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met.
     * Use `super` in contracts that inherit from Crowdsale to extend their validations.
     * @param _beneficiary Address performing the token purchase
     * @param _sbcAmount stableCoin amount involved in the purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _sbcAmount)
        internal
        view
        virtual
    {
        require(
            _beneficiary != address(0),
            "Crowdsale: beneficiary is the zero address"
        );
        require(_sbcAmount > 0, "Crowdsale: stableCoin amount > 0");
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        // TODO what is the line above ?
    }

    /**
     * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid
     * conditions are not met.
     * @param _beneficiary Address performing the token purchase
     * @param _sbcAmount Value in stable coin involved in the purchase
     */
    function _postValidatePurchase(address _beneficiary, uint256 _sbcAmount)
        internal
        view
    {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * @param _beneficiary Address performing the token purchase
     * @param _tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address _beneficiary, uint256 _tokenAmount)
        internal
    {
        token.safeTransfer(_beneficiary, _tokenAmount);
    }

    /**
     * @dev Executed when a purchase has been validated and is ready to be executed. Doesn't necessarily emit/send
     * tokens.
     * @param _beneficiary Address receiving the tokens
     * @param _tokenAmount Number of tokens to be purchased
     */
    function _processPurchase(address _beneficiary, uint256 _tokenAmount)
        internal
    {
        _deliverTokens(_beneficiary, _tokenAmount);
    }

    /**
     * @dev Override for extensions that require an internal state to check for validity (current user contributions,
     * etc.)
     * @param _beneficiary Address receiving the tokens
     * @param _sbcAmount Value in staleCoin involved in the purchase
     */
    function _updatePurchasingState(address _beneficiary, uint256 _sbcAmount)
        internal
    {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param _sbcAmount Value in stableCoins to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _sbcAmount
     */
    function _getTokenAmount(uint256 _sbcAmount)
        internal
        view
        returns (uint256)
    {
        return _sbcAmount.mul(rate);
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param _tokenAmount Value in token to be converted into stableCoin
     * @return Number of stableCoin that can be purchased with the specified _tokenAmount
     */
    function _getStableCoinAmount(uint256 _tokenAmount)
        internal
        view
        returns (uint256)
    {
        return _tokenAmount.div(rate);
    }

    /**
     * @dev Forward stablecoin funds to contract owner
     * @param _beneficiary Address sending the stableCoins
     * @param _tokenAmount Number of stableCoins token to transfer
     */
    function _forwardFunds(address _beneficiary, uint256 _tokenAmount)
        internal
        virtual
    {
        stableCoin.safeTransferFrom(_beneficiary, owner(), _tokenAmount);
    }
}
