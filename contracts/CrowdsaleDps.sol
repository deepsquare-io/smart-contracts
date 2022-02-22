// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./helper/Crowdsale.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// TODO remove console.sol later on
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
            _emptyAddressAndReference(_reference, msg.sender),
            "CrowdsaleDps: reference already used"
        );
        _setReference(_reference, msg.sender);
    }

    /**
     * Transfer tokens after getting user KYC reference
     * @param _reference Kyc reference
     */
    function transferTokensViaReference(
        string memory _reference,
        uint256 _weiAmount,
        address _beneficiary
    ) public payable onlyOwner {
        if (_emptyAddressAndReference(_reference, _beneficiary)) {
            _setReference(_reference, _beneficiary);
        }

        _requireRegistered(_beneficiary);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(_weiAmount);

        // update state
        _weiRaised = _weiRaised.add(_weiAmount);

        _processPurchase(_beneficiary, tokens);
        emit TokensPurchased(_msgSender(), _beneficiary, _weiAmount, tokens);
    }

    // TODO finish
    function closeCrowdsale() public onlyOwner {}

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
        require(
            msg.sender != owner(),
            "CrowdsaleDps: caller cannot be the owner"
        );
        _requireRegistered(_beneficiary);
    }

    function _forwardFunds(uint256 _weiAmount) internal override {
        stableCoinToken.transferFrom(msg.sender, owner(), _weiAmount);
    }

    function _requireRegistered(address _beneficiary) internal view {
        require(
            keccak256(bytes(referenceFromAddress[_beneficiary])) !=
                keccak256(""),
            "CrowdsaleDps: caller is not KYC registered"
        );
    }

    /**
     * @notice Sets kyc reference corresponding to beneficiary
     */
    function _setReference(string memory _reference, address _beneficiary)
        internal
    {
        referenceFromAddress[_beneficiary] = _reference;
        addressFromReference[_reference] = _beneficiary;
    }

    /**
     * @notice Address and reference exist in the contract mapping
     */
    function _emptyAddressAndReference(
        string memory _reference,
        address _beneficiary
    ) internal view returns (bool) {
        return
            addressFromReference[_reference] == address(0) &&
            keccak256(bytes(referenceFromAddress[_beneficiary])) ==
            keccak256("");
    }
}
