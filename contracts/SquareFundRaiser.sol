// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./ReferenceTable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract SquareFundRaiser is ReferenceTable {
    IERC20 public fundingStableCoin;

    uint96 public cUsdtPerSquare;

    uint96 public nextFundingCap;

    uint96 public fundingCapCurrentState;

    string public iban;


    mapping(address => mapping(address => uint96)) internal allowances;

    /// @notice A record of each accounts delegate
    mapping(address => address) public delegates;

    /// @notice A checkpoint for marking number of votes from a given block
    struct Checkpoint {
        uint32 fromBlock;
        uint96 votes;
    }

    /// @notice A record of votes checkpoints for each account, by index
    mapping(address => mapping(uint32 => Checkpoint)) public checkpoints;

    /// @notice The number of checkpoints for each account
    mapping(address => uint32) public numCheckpoints;

    /// @notice A record of states for signing / validating signatures
    mapping(address => uint256) public nonces;

    /// @notice An event thats emitted when an account changes its delegate
    event DelegateChanged(
        address indexed delegator,
        address indexed fromDelegate,
        address indexed toDelegate
    );

    /// @notice An event thats emitted when a delegate account's vote balance changes
    event DelegateVotesChanged(
        address indexed delegate,
        uint256 previousBalance,
        uint256 newBalance
    );


    /**
     * @notice Construct a new Square token
     * @param account The initial account to grant all the tokens
     */
    function initialize(address fundingStableCoinAddress)
        public
        initializer
    {
        super.__ReferenceTable_init();
        // initialization of parameters
        cUsdtPerSquare = 20;
        nextFundingCap = 10e12; // 10 million token ($600k)
        fundingCapCurrentState = 0;
        iban = "";

        //TODO : Shouldn't this go to the already set _owner (e.g. msg.sender)
        fundingStableCoin = IERC20(fundingStableCoinAddress);
    }



    /**
     * @notice Fund with USDT
     * @param rawAmount the USDT amount to fund with
     */
    function fundViaUSDT(string memory userId, uint256 rawAmount)
        external
        returns (bool)
    {
        require(msg.sender != owner(), "Square::caller cannot be the owner");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(getCurrentReference())),
            "Square::caller must be the registered address"
        );

        address _funder = msg.sender;
        address _owner = owner();
        uint96 amountUSDT = safe96(
            rawAmount,
            "Square::transfer: amount exceeds 96 bits"
        );
        uint96 amountSQUARE = safe96(
            (amountUSDT * 100) / cUsdtPerSquare,
            "Square::transfer: converted amount of DPS exceeds 96 bits"
        );

        fundingCapCurrentState = fundingCapCurrentState + amountSQUARE;
        require(
            fundingCapCurrentState <= nextFundingCap,
            "Square::no more DPS available for distribution in this step. Wait the next step in order to continue funding"
        );

        fundingStableCoin.transferFrom(_funder, _owner, amountUSDT);
        _transferTokens(_owner, _funder, amountSQUARE);

        return true;
    }

    /**
     * @notice Sets cUsdtPerSquare
     * @param _address the address to use for the fundingStableCoin
     */
    function setfundingStableCoinAddress(address _address) public onlyOwner {
        fundingStableCoin = IERC20(_address);
    }

    /**
     * @notice Sets cUsdtPerSquare
     * @param _cUsdtPerSquare the amount of square wei for 1 USDT
     */
    function setcUsdtPerSquare(uint96 _cUsdtPerSquare) public onlyOwner {
        cUsdtPerSquare = _cUsdtPerSquare;
    }

    /**
     * @notice Sets squarePerUSDT
     * @param _nextFundingCap the amount of square wei for 1 USDT
     */
    function setNextFundingCap(uint96 _nextFundingCap) public onlyOwner {
        // Resets the current fundingCapStatus
        fundingCapCurrentState = 0;
        nextFundingCap = _nextFundingCap;
    }

    /**
     * @notice Sets iban associated to contract
     * @param _iban the iban
     */
    function setIban(string memory _iban) public onlyOwner {
        iban = _iban;
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
    function transferWithReference(string memory ref, uint256 rawAmount)
        external
        onlyOwner
        returns (bool)
    {
        uint96 amountSQUARE = safe96(
            rawAmount,
            "Square::transfer: amount exceeds 96 bits"
        );
        fundingCapCurrentState = fundingCapCurrentState + amountSQUARE;
        require(
            fundingCapCurrentState <= nextFundingCap,
            "Square::no more DPS available for distribution in this step. Reset the nextFundingCap to start next phase"
        );
        address dst = getAddressByReference(ref);

        if (dst != address(0)) {
            _transferTokens(msg.sender, dst, amountSQUARE);
            return true;
        } else {
            return false;
        }
    }



    /**
     * @notice Gets the current votes balance for `account`
     * @param account The address to get votes balance
     * @return The number of current votes for `account`
     */
    function getCurrentVotes(address account) external view returns (uint96) {
        uint32 nCheckpoints = numCheckpoints[account];
        return
            nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
    }

    /**
     * @notice Determine the prior number of votes for an account as of a block number
     * @dev Block number must be a finalized block or else this function will revert to prevent misinformation.
     * @param account The address of the account to check
     * @param blockNumber The block number to get the vote balance at
     * @return The number of votes the account had as of the given block
     */
    function getPriorVotes(address account, uint256 blockNumber)
        public
        view
        returns (uint96)
    {
        require(
            blockNumber < block.number,
            "Square::getPriorVotes: not yet determined"
        );

        uint32 nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }

        // First check most recent balance
        if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
            return checkpoints[account][nCheckpoints - 1].votes;
        }

        // Next check implicit zero balance
        if (checkpoints[account][0].fromBlock > blockNumber) {
            return 0;
        }

        uint32 lower = 0;
        uint32 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint32 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
            Checkpoint memory cp = checkpoints[account][center];
            if (cp.fromBlock == blockNumber) {
                return cp.votes;
            } else if (cp.fromBlock < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return checkpoints[account][lower].votes;
    }



    function _writeCheckpoint(
        address delegatee,
        uint32 nCheckpoints,
        uint96 oldVotes,
        uint96 newVotes
    ) internal {
        uint32 blockNumber = safe32(
            block.number,
            "Square::_writeCheckpoint: block number exceeds 32 bits"
        );

        if (
            nCheckpoints > 0 &&
            checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber
        ) {
            checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
        } else {
            checkpoints[delegatee][nCheckpoints] = Checkpoint(
                blockNumber,
                newVotes
            );
            numCheckpoints[delegatee] = nCheckpoints + 1;
        }

        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }

    function safe32(uint256 n, string memory errorMessage)
        internal
        pure
        returns (uint32)
    {
        require(n < 2**32, errorMessage);
        return uint32(n);
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
