// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./helper/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdsaleDps is Crowdsale, Ownable {
    using SafeMath for uint256;

    // TODO is there a better way than two arrays ?
    mapping(address => string) public referenceFromAddress;
    mapping(string => address) public addressFromReference;

    IERC20 public stableCoinToken;

    constructor(
        uint256 _rate,
        address _dpsContractAddress,
        address _stableCoinContractAddress
    )
        Crowdsale(
            _rate,
            payable(0x9632a79656af553F58738B0FB750320158495942),
            IERC20(_dpsContractAddress)
        )
    {
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
    function transferTokensViaReference(string memory _reference)
        public
        payable
        onlyOwner
    {
        buyTokens(addressFromReference[_reference]);
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
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(msg.sender != owner(), "Caller cannot be the owner");
        require(
            keccak256(bytes(referenceFromAddress[_beneficiary])) !=
                keccak256(""),
            "Caller is not registered"
        );
    }

    function _forwardFunds() internal override {
        stableCoinToken
    }
}
