// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISecurity.sol";

/**
 * @title LockingSecurity
 * @author Mathieu Bour, Valentin Pollart and Clarisse Tarrou for the DeepSquare Association.
 * @notice Allow to lock DPS tokens on holders balances for a certain amount of time.
 * @dev This contracts acts as a replacement the SpenderSecurity contract, by allowing DPS holders to receive funds,
 * but restricting the to move the funds before a certain date.
 * In order to continue to conduct private DPS sale, it introduces the SALE role, which is essentially the same as the
 * former SPENDER role.
 * In the future, we will probably write v2 of this contract which will save gas by using time-ordered locks.
 */
contract LockingSecurity is ISecurity, AccessControl {
    struct Lock {
        uint256 value; // The lock DPS amount
        uint256 release; // The release date in seconds since the epoch
    }

    bytes32 public constant SALE = keccak256("SALE");

    /**
     * @dev The vested token.
     */
    IERC20 public DPS;

    /**
     * @dev The DPS/SQUARE bridge address.
     */
    address public bridge;

    /**
     * @dev The vesting locks, mapped by account addresses.
     * There is no guarantee that the locks are ordered by release date time.
     */
    mapping(address => Lock[]) public locks;

    constructor(IERC20 _token) ISecurity() {
        DPS = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Check if the DPS transfer should be authorized.
     * @param sender The account which triggered the transfer.
     * @param from The account from where the tokens will be taken.
     * @dev Requirements:
     * - if the sender is the bridge or has the role 'DEFAULT_ADMIN_ROLE' or has the role 'SALE', no further verification is made.
     * - else, the receiver has to be the bridge and the account from where the tokens will be taken has to have sufficient available funds.
     */
    function validateTokenTransfer(
        address sender,
        address from,
        address to,
        uint256 amount
    ) external view {
        if (sender == bridge || hasRole(DEFAULT_ADMIN_ROLE, sender) || hasRole(SALE, sender)) {
            return;
        }

        require(to == bridge, "LockingSecurity: destination is not the bridge");
        require(amount < available(from, block.timestamp), "LockingSecurity: transfer amount exceeds available tokens");
    }

    /**
     * @notice Compute how much tokens are locked for a give account.
     * @dev This acts a as "minimum balance".
     * @param account The address to check
     * @param currentDate The date reference to use.
     */
    function locked(address account, uint256 currentDate) public view returns (uint256) {
        uint256 sum = 0;

        for (uint256 i = 0; i < locks[account].length; i++) {
            if (locks[account][i].release < currentDate) continue;

            sum += locks[account][i].value;
        }

        return sum;
    }

    /**
     * @notice Compute how much DPS is available (=not locked) for a given account.
     */
    function available(address account, uint256 currentDate) public view returns (uint256) {
        uint256 a = DPS.balanceOf(account);
        uint256 b = locked(account, currentDate);

        return a <= b ? 0 : a - b;
    }

    /**
     * @notice Allow the owner to upgrade the bridge.
     */
    function upgradeBridge(address newBridge) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bridge = newBridge;
    }

    /**
     * @notice Lock DPS to an investor.
     */
    function lock(address investor, Lock memory details) external onlyRole(DEFAULT_ADMIN_ROLE) {
        locks[investor].push(details);
    }

    /**
     * @notice Lock and transfer DPS to an investor at the same time.
     * @dev The sender has to allow the contract to transfer DPS first using the increaseAllowance method first.
     */
    function vest(address investor, Lock memory details) external onlyRole(DEFAULT_ADMIN_ROLE) {
        locks[investor].push(details);
        DPS.transferFrom(msg.sender, investor, details.value);
    }
}
