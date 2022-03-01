// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./helper/Crowdsale.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// TODO remove console.sol later on
import "hardhat/console.sol";

import "./IDeepSquareToken.sol";

contract CrowdsaleDps is Crowdsale {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // sets bijection between KYC reference and user address
    mapping(address => string) public referenceFromAddress;
    mapping(string => address) public addressFromReference;

    // dps contract address
    address public dpsContract;

    constructor(
        uint256 _rate,
        address _dpsContract,
        address _stableCoinContract
    ) Crowdsale(_rate, IERC20(_dpsContract), IERC20(_stableCoinContract)) {
        dpsContract = _dpsContract;
    }

    /**
     * @notice Sets kyc reference to a specific beneficiary
     * @param _to Address associated to KYC reference
     * @param _reference KYC reference associated to beneficiary
     */
    function setReference(address _to, string memory _reference)
        public
        onlyOwner
    {
        _setReference(_to, _reference);
    }

    /**
     * @notice Remove KYC mapping between reference and address
     * @param _to Address associated to KYC reference
     * @param _reference KYC reference associated to address
     */
    function removeReference(address _to, string memory _reference)
        public
        onlyOwner
    {
        require(
            addressFromReference[_reference] != address(0),
            "CrowdsaleDps: reference does not exist"
        );

        require(
            !_isEqual(referenceFromAddress[_to], ""),
            "CrowdsaleDps: address does not exist"
        );

        addressFromReference[_reference] = address(0);
        referenceFromAddress[_to] = "";
    }

    /**
     * @notice Sets kyc reference corresponding to your own address
     * @param _reference KYC reference
     */
    function setOwnReference(string memory _reference) public {
        _setReference(msg.sender, _reference);
    }

    /**
     * @notice Set user KYC reference and transfer tokens to beneficiary
     * @param _beneficiary Address that receive tokens
     * @param _tokenAmount Amount of token to send to beneficiary
     * @param _reference Associated KYC reference
     */
    function transferTokensViaReference(
        address _beneficiary,
        uint256 _tokenAmount, // TODO method is call transferTokens, but parameter does NOT represent tokens
        string memory _reference
    ) public payable onlyOwner {
        // set reference if it does not exist yet
        if (_isAddressAndReferenceEmpty(_beneficiary, _reference)) {
            _setReference(_beneficiary, _reference);
        }

        // require that reference exists
        _requireRegisteredReference(_beneficiary, _reference);

        // calculate corresponding stablecoin amount
        uint256 sbcAmount = _getStableCoinAmount(_tokenAmount);

        // update state
        sbcRaised = sbcRaised.add(sbcAmount);

        // purchase
        _processPurchase(_beneficiary, _tokenAmount);
        emit TokensPurchased(_msgSender(), _beneficiary, sbcAmount, _tokenAmount);
    }

    /**
     * @notice Close Crowdsale : transfer remaining DPS, revoke its access to DPS token
     */
    function closeCrowdsale() public onlyOwner {
        token.safeTransfer(dpsContract, token.balanceOf(address(this)));
        IDeepSquareToken(dpsContract).revokeAccess(address(this));
    }

    /**
     * @notice Extends Crowdsale._prevalidatePurchase method in order to add
     * restrictions before purchase
     * @param _beneficiary Address that buys tokens
     */
    function _preValidatePurchase(address _beneficiary, uint256 _sbcAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(_beneficiary, _sbcAmount);
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
     * @notice Sets KYC reference corresponding to beneficiary
     * @param _to Address associated to KYC reference
     * @param _reference KYC reference
     */
    function _setReference(address _to, string memory _reference) internal {
        require(
            _isAddressAndReferenceEmpty(_to, _reference),
            "CrowdsaleDps: reference already used"
        );

        referenceFromAddress[_to] = _reference;
        addressFromReference[_reference] = _to;
    }

    /**
     * @notice Returns true if address and reference do not exist in the contract mapping
     * @param _to Address associated to KYC reference
     * @param _reference KYC reference associated to address
     */
    function _isAddressAndReferenceEmpty(address _to, string memory _reference)
        internal
        view
        returns (bool)
    {
        return
            addressFromReference[_reference] == address(0) &&
            _isEqual(referenceFromAddress[_to], "");
    }

    /**
     * @notice Reverts if reference is not registered correctly
     * @param _to Address associated to KYC reference
     * @param _reference KYC reference associated to address
     */
    function _requireRegisteredReference(address _to, string memory _reference)
        internal
        view
    {
        bool referenceMatch = _isEqual(referenceFromAddress[_to], _reference);
        bool addressMatch = addressFromReference[_reference] == _to;

        require(
            referenceMatch && addressMatch,
            "CrowdsaleDps: caller is not KYC registered"
        );
    }

    /**
     * @notice returns true if two parameter string are equal
     * @param stringA first string
     * @param stringB second string
     */
    function _isEqual(string memory stringA, string memory stringB)
        internal
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(stringA)) ==
            keccak256(abi.encodePacked(stringB));
    }
}
