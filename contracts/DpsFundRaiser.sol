// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./ReferenceTable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DpsFundRaiser is ReferenceTable {
    IERC20 public stableCoinContract;

    IERC20 public dpsContract;

    uint96 public cUsdtPerDps;

    uint96 public nextFundingCap;

    uint96 public fundingCapCurrentState;

    function initialize(
        address _stableCoinContractAddress,
        address _dpsContractAddress
    ) public initializer {
        super.__ReferenceTable_init();
        dpsContract = IERC20(_dpsContractAddress);
        stableCoinContract = IERC20(_stableCoinContractAddress);
        cUsdtPerDps = 20;
        nextFundingCap = 10e12; // 10 million token ($600k)
        fundingCapCurrentState = 0;
    }

    /**
     * @notice Get the number of DPS available in current funding phase
     * @return The number of tokens remaining in current phase
     */
    function getRemainingDPSInPhase() external view returns (uint256) {
        return nextFundingCap - fundingCapCurrentState;
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
        fundingCapCurrentState = 0;
        nextFundingCap = _nextFundingCap;
    }

    /**
     * @notice Fund with USDT
     * @param rawAmount the USDT amount to fund with
     */
    function fundViaUSDT(string memory userId, uint256 rawAmount)
        external
        returns (bool)
    {
        require(msg.sender != owner(), "caller cannot be the owner");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(getCurrentReference())),
            "Caller must be the registered address"
        );

        uint96 amountUSDT = safe96(
            rawAmount,
            "transfer: amount exceeds 96 bits"
        );
        uint96 amountDps = safe96(
            (amountUSDT * 100) / cUsdtPerDps,
            "transfer: converted amount of DPS exceeds 96 bits"
        );

        increaseCap(amountDps);

        address _funder = msg.sender;
        address _owner = owner();

        // TODO add conditions that everything goes alright. approval maybe ?
        stableCoinContract.transferFrom(_funder, _owner, amountUSDT);
        dpsContract.transferFrom(_owner, _funder, amountDps);

        return true;
    }

    function transferWithReference(string memory ref, uint256 rawAmount)
        external
        onlyOwner
        returns (bool)
    {
        uint96 amountDps = safe96(
            rawAmount,
            "Transfer amount exceeds 96 bits."
        );

        increaseCap(amountDps);
        address dst = getAddressByReference(ref);

        // TODO improve this part, use revert ?
        if (dst != address(0)) {
            dpsContract.transfer(dst, amountDps);
            return true;
        } else {
            return false;
        }
    }

    // TODO uint96 for amountDPS ? Use safeMath, or BigNumbers ?
    function increaseCap(uint96 amountDPS) internal {
        fundingCapCurrentState += amountDPS;
        require(
            fundingCapCurrentState <= nextFundingCap,
            "No more DPS available for distribution in this funding phase"
        );
    }

    function safe96(uint256 n, string memory errorMessage)
        internal
        pure
        returns (uint96)
    {
        require(n < 2**96, errorMessage);
        return uint96(n);
    }
}
