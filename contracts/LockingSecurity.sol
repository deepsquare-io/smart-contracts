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
contract LockingSecurity is ISecurity, AccessControl, Ownable {
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
    mapping(address => Lock[]) private _locks;

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
    ) external {
        if (sender == bridge || hasRole(DEFAULT_ADMIN_ROLE, sender) || hasRole(SALE, sender)) {
            return;
        }

        require(to == bridge, "LockingSecurity: destination is not the bridge");

        // solhint-disable-next-line not-rely-on-time
        require(amount <= available(from, block.timestamp), "LockingSecurity: transfer amount exceeds available tokens");

        // solhint-disable-next-line not-rely-on-time
        Lock[] memory newSchedule = schedule(from, block.timestamp);

        // If schedule length is different than the locks, it means that some locks need to be deleted
        if (_locks[from].length != newSchedule.length) {
            uint oldLength = _locks[from].length;

            for (uint256 i = 0; i < newSchedule.length; i++) {
                _locks[from][i] = newSchedule[i];
            }

            for (uint256 i = 0; i < oldLength - newSchedule.length; i++) {
                _locks[from].pop();
            }
        }
    }

    /**
     * @notice Allow the owner to upgrade the bridge.
     * @param newBridge New address of the bridge.
     */
    function upgradeBridge(address newBridge) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bridge = newBridge;
    }

    /**
     * @notice Returns the list of an investors locked funds.
     * @dev Works as a getter.
     * @param investor Address of the investor.
     */
    function locks(address investor) public view returns (Lock[] memory) {
        return _locks[investor];
    }

    /**
     * @notice Get the vesting schedule of an account.
     * @dev There is date or amount sorting guarantee.
     * @param account The address to check
     */
    function schedule(address account, uint256 currentDate) public view returns (Lock[] memory) {
        Lock[] memory _accountLocks = locks(account);
        Lock[] memory _tmpLocks = new Lock[](_accountLocks.length);
        uint256 found = 0;

        for (uint256 i = 0; i < _accountLocks.length; i++) {
            if (_accountLocks[i].release <= currentDate) continue;

            _tmpLocks[found] = _accountLocks[i];
            found++;
        }

        Lock[] memory _activeLocks = new Lock[](found);

        for (uint256 j = 0; j < found; j++) {
            _activeLocks[j] = _tmpLocks[j];
        }

        return _activeLocks;
    }

    /**
     * @notice Compute how much tokens are locked for a give account.
     * @dev This acts a as "minimum balance".
     * @param account The address to check
     * @param currentDate The date reference to use.
     */
    function locked(address account, uint256 currentDate) public view returns (uint256) {
        Lock[] memory _activeLocks = schedule(account, currentDate);
        uint256 sum = 0;

        for (uint256 i = 0; i < _activeLocks.length; i++) {
            sum += _activeLocks[i].value;
        }

        return sum;
    }

    /**
     * @notice Compute how much DPS is available (=not locked) for a given account at a given date.
     * @param account The address of the account to check.
     * @param currentDate The date to check.
     */
    function available(address account, uint256 currentDate) public view returns (uint256) {
        uint256 a = DPS.balanceOf(account);
        uint256 b = locked(account, currentDate);

        return a <= b ? 0 : a - b;
    }

    /**
     * @notice Lock DPS to an investor.
     * @param investor Address of the investor.
     * @param details The amount to lock and the release date in epoch.
     */
    function lock(address investor, Lock memory details) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _locks[investor].push(details);
    }

    /**
     * @notice Batch lock DPS to investors.
     * @param investors Address of the investors.
     * @param details The lock details.
     */
    function lockBatch(address[] memory investors, Lock[] memory details) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(investors.length == details.length, "LockingSecurity: lock batch size mismatch");

        for (uint256 i = 0; i < investors.length; i++) {
            lock(investors[i], details[i]);
        }
    }

    /**
     * @notice Lock and transfer DPS to an investor at the same time.
     * @dev The sender has to allow the contract to transfer DPS first using the increaseAllowance method first.
     * @param investor Address of the investor.
     * @param details The amount to lock and the release date in epoch.
     */
    function vest(address investor, Lock memory details) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _locks[investor].push(details);
        DPS.transferFrom(msg.sender, investor, details.value);
    }

    /**
     * @notice Batch lock DPS to investors.
     * @param investors Address of the investors.
     * @param details The lock details.
     */
    function vestBatch(address[] memory investors, Lock[] memory details) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(investors.length == details.length, "LockingSecurity: vest batch size mismatch");

        for (uint256 i = 0; i < investors.length; i++) {
            vest(investors[i], details[i]);
        }
    }
}
