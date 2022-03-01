// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./helper/Crowdsale.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// TODO remove console.sol later on
import "hardhat/console.sol";

import "./IDeepSquareToken.sol";

contract CrowdsaleDps is Crowdsale, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping(address => string) public referenceFromAddress;
    mapping(string => address) public addressFromReference;

    IERC20 public stableCoinToken;

    address dpsContractAddress;

    constructor(
        uint256 _rate,
        address _dpsContractAddress,
        address _stableCoinContractAddress
    ) Crowdsale(_rate, IERC20(_dpsContractAddress)) Ownable() {
        stableCoinToken = IERC20(_stableCoinContractAddress);
        dpsContractAddress = _dpsContractAddress;
    }

    /**
     * @notice Sets kyc reference to a specific beneficiary
     */
    function setReference(address _beneficiary, string memory _reference)
        public
        onlyOwner
    {
        _setReference(_beneficiary, _reference);
    }

    function removeReference(address _to, string memory _reference)
        public
        onlyOwner
    {
        require(
            addressFromReference[_reference] != address(0),
            "CrowdsaleDps: reference does not exist"
        );

        require(
            keccak256(abi.encodePacked(referenceFromAddress[_to])) !=
                keccak256(abi.encodePacked("")),
            "CrowdsaleDps: address does not exist"
        );

        addressFromReference[_reference] = address(0);
        referenceFromAddress[_to] = "";
    }

    /**
     * @notice Sets kyc reference corresponding to your own address
     */
    function setOwnReference(string memory _reference) public {
        _setReference(msg.sender, _reference);
    }

    /**
     * @notice Set user KYC reference and transfer tokens to beneficiary
     */
    function transferTokensViaReference(
        address _beneficiary,
        uint256 _weiAmount, // TODO method is call transferTokens, but parameter does NOT represent tokens
        string memory _reference
    ) public payable onlyOwner {
        // set reference if it does not exist yet
        if (_emptyAddressAndReference(_beneficiary, _reference)) {
            _setReference(_beneficiary, _reference);
        }

        // require that reference exists
        _requireRegisteredReference(_beneficiary, _reference);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(_weiAmount);

        // update state
        weiRaised = weiRaised.add(_weiAmount);

        _processPurchase(_beneficiary, tokens);
        emit TokensPurchased(_msgSender(), _beneficiary, _weiAmount, tokens);
    }

    // TODO finish
    function closeCrowdsale() public onlyOwner {
        token.safeTransfer(
            dpsContractAddress,
            token.balanceOf(address(this))
        );
        IDeepSquareToken(dpsContractAddress).revokeAccess(address(this));
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
        require(
            msg.sender != owner(),
            "CrowdsaleDps: caller cannot be the owner"
        );
        _requireRegisteredReference(
            _beneficiary,
            referenceFromAddress[_beneficiary]
        );
    }

    /**
     * @notice Extends crowdsale forward funds. TODO should be refactored */
    function _forwardFunds(uint256 _weiAmount) internal override {
        stableCoinToken.transferFrom(msg.sender, owner(), _weiAmount);
    }

    /**
     * @notice Sets kyc reference corresponding to beneficiary
     */
    function _setReference(address _beneficiary, string memory _reference)
        internal
    {
        require(
            _emptyAddressAndReference(_beneficiary, _reference),
            "CrowdsaleDps: reference already used"
        );

        referenceFromAddress[_beneficiary] = _reference;
        addressFromReference[_reference] = _beneficiary;
    }

    /**
     * @return true if address and reference do not exist in the contract mapping
     */
    function _emptyAddressAndReference(
        address _beneficiary,
        string memory _reference
    ) internal view returns (bool) {
        return
            addressFromReference[_reference] == address(0) &&
            keccak256(bytes(referenceFromAddress[_beneficiary])) ==
            keccak256("");
    }

    /**
     * @notice Reverts if reference is not registered correctly
     */
    function _requireRegisteredReference(
        address _beneficiary,
        string memory _reference
    ) internal view {
        bool referenceMatch = keccak256(
            bytes(referenceFromAddress[_beneficiary])
        ) == keccak256(bytes(_reference));

        bool addressMatch = addressFromReference[_reference] == _beneficiary;

        require(
            referenceMatch && addressMatch,
            "CrowdsaleDps: caller is not KYC registered"
        );
    }
}
