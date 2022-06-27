// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./VotingDelegation.sol";
import "./BallotFactory.sol";

/**
 * @title Ballot
 * @author Mathieu Bour, Valentin Pollart, Clarisse Tarrou and Charly Mancel for the DeepSquare Association.
 * @dev Implementation of a ballot for a voting feature.
 */

contract Ballot is Ownable, Initializable {
    // @dev Contract defining the DPS token
    IERC20Metadata public DPS;

    // @dev Contract allowing user to delegate their vote on specific topics
    VotingDelegation public proxy;

    // @dev The ballot factory
    BallotFactory public factory;

    struct Vote {
        bytes32 choice;
        bool hasVoted;
    }

    /**
     * @notice The title or question of the vote
     */
    bytes32 public title;

    /**
     * @notice The description of the vote
     */
    bytes32 public description;

    /**
     * @notice Whether users can still vote or not
     */
    bool public closed;

    /**
     * @notice The topic of the vote, used to know if user has delegated or has delegation on this vote
     */
    bytes32 public topic;

    /**
     * @notice The different choices of the vote
     */
    bytes32[] public choices;

    /**
     * @notice The results of this vote, which are available only once the vote has been closed
     */
    mapping(bytes32 => uint256) public resultStorage;

    /**
     * @notice The minimum amount a user must have to be able to vote (25k DPS)
     */
    uint256 public immutable votingLimit = 25e3 * 1e18;

    /**
     * @notice The list of all voters
     */
    address[] internal voters;

    /**
     * @notice The choice selected by each voter
     */
    mapping(address => Vote) internal votes;

    /**
     * @dev It is necessary to set these values in the ballot implementation since the balot factory use them to initialize clones
     */
    constructor(IERC20Metadata _DPS, VotingDelegation _proxy) {
        DPS = _DPS;
        proxy = _proxy;
    }

    /**
     * @notice Set up all state variable for clone contracts.
     * @dev Can only be called once, usually right after contract creation.
     * @param _DPS The contract defining the DPS token
     * @param _proxy The contract allowing users to delegates their vote on specific topics
     * @param _factory The factory that created this clone contract instance
     * @param _title The subject or question of the vote
     * @param _description The subject or question of the vote
     * @param _topic The topic of the vote
     * @param _choices The different choices for this vote
     */
    function init(IERC20Metadata _DPS, VotingDelegation _proxy, string memory _title, string memory _description, string memory _topic, string[] memory _choices) public initializer {
        title = keccak256(bytes(_title));
        description = keccak256(bytes(_description));
        topic = keccak256(bytes(_topic));
        closed = false;
        choices = new bytes32[](_choices.length);
        for(uint i = 0; i < _choices.length; i++) {
            choices[i] = keccak256(bytes(_choices[i]));
        }
        DPS = _DPS;
        proxy = _proxy;
        factory = BallotFactory(msg.sender);
    }

    /**
     * @notice Returns all choices of the vote
     */
    function getChoices() external view returns(bytes32[] memory) {
        return choices;
    }

    function isValidChoice(bytes32 choiceHash) public view returns (bool) {
        for (uint i = 0; i < choices.length; i++) {
            if (choices[i] == choiceHash) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Send vote for given choice.
     * @dev Requirements:
     * - Vote MUST be open.
     * - Choice MUST be a valid choice (belongs to the choices array).
     * - Voter MUST NOT have delegated his vote.
     * - Voter MUST have at least 25k DPS.
     * @param choice The choice one want to vote for.
     */
    function vote(string memory choice) external {
        require(!closed, "Voting: Ballot is closed.");

        require(!proxy.hasDelegated(msg.sender,topic), "Voting: Vote is delegated."); // Verify that voter has not granted proxy to somebody.

        require(DPS.balanceOf(msg.sender) >= votingLimit, "Voting: Not enough DPS to vote."); // 25k DPS limit

        bytes32 choiceHash = keccak256(bytes(choice));

        require(isValidChoice(choiceHash), "Voting: Choice is invalid.");

        if(!votes[msg.sender].hasVoted) {
            votes[msg.sender].hasVoted = true;
            voters.push(msg.sender);
        }

        votes[msg.sender].choice = choiceHash;
    }

    /**
     * @notice Returns if given voter has voted
     * @param voter The voter
     */
    function hasVoted(address voter) external view returns(bool) {
        return votes[voter].hasVoted;
    }

    /**
     * @notice Returns the voter's vote
     */
    function getVote(address voter) external view returns(bytes32) {
        return votes[voter].choice;
    }

    /**
     * @notice Close the vote, preventing users to vote afterwards
     * @dev The caller MUST be the ballot factory owner
     */
    function close() external {
        require(msg.sender == factory.owner(), "Voting: Restricted to factory owner.");
        require(!closed, "Voting: Ballot already closed.");

        closed = true;

        for(uint i = 0; i < voters.length; i++) { // if A has granted proxy to B
            address voter = voters[i];
            resultStorage[votes[voter].choice] += DPS.balanceOf(voter) + proxy.delegationAmount(voter, topic);
        }

        factory.archiveBallot();
    }
}
