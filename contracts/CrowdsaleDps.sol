// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./helper/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CrowdsaleDps is Crowdsale, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // TODO is there a better way than two arrays ?
    mapping(address => string) public referenceFromAddress;
    mapping(string => address) public addressFromReference;

    IERC20 public stableCoinToken;

    constructor(
        uint256 _rate,
        address _dpsContractAddress,
        address _stableCoinContractAddress
    ) Crowdsale(_rate, IERC20(_dpsContractAddress)) Ownable() {
        stableCoinToken = IERC20(_stableCoinContractAddress);
        // TODO change rate and wallet address
    }

    /**
     * @notice Sets kyc reference corresponding to sender address
     * @param _reference the reference
     */
    function setReference(string memory _reference) public {
        require(
            addressFromReference[_reference] == address(0) &&
                keccak256(bytes(referenceFromAddress[msg.sender])) ==
                keccak256(""), // && referenceFromAddress[msg.sender] == "",
            "CrowdsaleDps: already used"
        );
        referenceFromAddress[msg.sender] = _reference;
        addressFromReference[_reference] = msg.sender;
    }

    /**
     * Transfer tokens after getting user KYC reference
     * @param _reference Kyc reference
     */
    function transferTokensViaReference(
        string memory _reference,
        uint256 weiAmount
    ) public payable onlyOwner {
        buyTokens(addressFromReference[_reference], weiAmount);
    }

    /**
     * @notice Extends Crowdsale._prevalidatePurchase method in order to add
     * restrictions before purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
        view
        override
    {
        payable(owner());
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(msg.sender != owner(), "Caller cannot be the owner");
        require(
            keccak256(bytes(referenceFromAddress[_beneficiary])) !=
                keccak256(""),
            "Caller is not registered"
        );
    }

    // TODO WHO SHOULD IT SEND MONEY TO ? Contract owner ?
    function _forwardFunds(uint256 _weiAmount) internal override {
        console.log(msg.sender);
        console.log(owner());
        console.log(stableCoinToken.allowance(owner(), msg.sender));
        stableCoinToken.transferFrom(
            msg.sender,
            owner(),
            1
        );
        
    }
}
