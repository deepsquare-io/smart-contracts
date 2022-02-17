// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./ReferenceTable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract DpsFundRaiser is ReferenceTable {
    IERC20 public stableCoinContract;

    IERC20 public dpsContract;
    // TODO change all the uint -> to less ? uint16 ?
    uint256 public cUsdtPerDps;

    uint256 public nextFundingCap;

    uint256 public currentFunding;

    function initialize(
        address _dpsContractAddress,
        address _stableCoinContractAddress,
        uint256 _currentFunding
    ) public initializer {
        super.__ReferenceTable_init();
        dpsContract = IERC20(_dpsContractAddress);
        stableCoinContract = IERC20(_stableCoinContractAddress);
        currentFunding = _currentFunding;

        cUsdtPerDps = 20;
        nextFundingCap = 10e12; // 10 million token ($600k). TODO change this ?
    }

    /**
     * @notice Get the number of DPS available in current funding phase
     * @return The number of tokens remaining in current phase
     */
    function getRemainingDpsInPhase() external view returns (uint256) {
        return nextFundingCap - currentFunding;
    }

    /**
     * @notice Transfer `amount` tokens from `msg.sender` to the address associated with the `ref`
     *         This only works if there is a reference associated to that address
     * @param ref The reference of the destination account
     * @param rawAmount The number of tokens to transfer
     * @return Whether or not the transfer succeeded
     */

    /**
     * @notice Sets cUsdtPerDps
     * @param _address the address to use for the fundingStableCoin
     */
    function setStableCoinContractAddress(address _address) public onlyOwner {
        stableCoinContract = IERC20(_address);
    }

    /**
     * @notice Sets cUsdtPerDps
     * @param _cUsdtPerDps the amount of square wei for 1 USDT
     */
    function setcUsdtPerDps(uint96 _cUsdtPerDps) public onlyOwner {
        cUsdtPerDps = _cUsdtPerDps;
    }

    // Resets the current fundingCapStatus
    function setNextFundingCap(uint96 _nextFundingCap) public onlyOwner {
        currentFunding = 0;
        nextFundingCap = _nextFundingCap;
    }

    function fundViaUSDT(string memory userId, uint256 amountUSDT)
        external
        returns (bool)
    {
        require(msg.sender != owner(), "Caller cannot be the owner");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(getCurrentReference())),
            "Caller must be the registered address"
        );

        uint256 amountDps = (amountUSDT * 100) / cUsdtPerDps;
        requireNotReachingFundingCap(amountDps);

        address _funder = msg.sender;
        address _owner = owner();

        // TODO add conditions that everything goes alright. approval maybe ?
        stableCoinContract.transferFrom(_funder, _owner, amountUSDT);
        dpsContract.transferFrom(_owner, _funder, amountDps);
        increaseFundingCap(amountDps);

        return true;
    }

    /**
     * Fund account linked to bank account reference with the right DPS amount.
     *
     * NOTE: TODO : ask Charly if amountDPS should not consider 18 decimals, added later on
     *
     */
    function fundViaReference(string memory ref, uint32 amountDps)
        external
        referenceExists(ref)
        onlyOwner
    {
        requireNotReachingFundingCap(amountDps);
        address receiver = getAddressByReference(ref);
        dpsContract.transferFrom(msg.sender, receiver, amountDps);
        increaseFundingCap(amountDps);
    }

    // TODO uint96 for amountDPS ? Use safeMath, or BigNumbers ?
    function increaseFundingCap(uint256 amountDPS) internal {
        currentFunding = currentFunding + amountDPS;
    }

    function requireNotReachingFundingCap(uint256 amountDPS) internal view {
        require(
            currentFunding + amountDPS <= nextFundingCap,
            "No more DPS available for distribution in this funding phase"
        );
    }
}
