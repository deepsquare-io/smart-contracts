// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISecurity.sol";

contract LockingSecurity is ISecurity, AccessControl, Ownable {
    struct Lock {
        uint256 value;
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
     * Allow the owner to upgrade the bridge.
     */
    function upgradeBridge(address newBridge) external onlyOwner {
        bridge = newBridge;
    }

    /**
     * @notice Lock DPS to an investor.
     */
    function lock(address investor, Lock memory details) external onlyOwner {
        locks[investor].push(details);
    }

    /**
     * @notice Lock and transfer DPS to an investor at the same time.
     */
    function vest(address investor, Lock memory details) external onlyOwner {
        locks[investor].push(details);
        DPS.transfer(investor, details.value);
    }
}
