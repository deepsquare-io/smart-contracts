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
        uint32 choiceIndex;
        bool hasVoted;
    }

    /**
     * @notice The subject or question of the vote
     */
    string public subject;

    /**
     * @notice Whether users can still vote or not
     */
    bool public closed;

    /**
     * @notice The topic of the vote, used to know if user has delegated or has delegation on this vote
     */
    string public topic;

    /**
     * @notice The diffrent choices of the vote
     */
    string[] public choices;

    /**
     * @notice The results of this vote, which are available only once the vote has been closed
     */
    uint256[] public resultStorage;

    /**
     * @notice The minimum amount a user must have to be able to vote (25k DPS)
     */
    uint256 immutable votingLimit = 25e3 * 1e18;

    /**
     * @notice The list of all voters
     */
    address[] internal voters;

    /**
     * @notice The choice selected by each voter
     */
    mapping(address => Vote) internal votes;

    /**
     * @notice Set up all state variable for clone contracts.
     * @dev Can only be called once, usually right after contract creation.
     * @param _DPS The contract defining the DPS token
     * @param _proxy The contract allowing users to delegates their vote on specific topics
     * @param _factory The factory that created this clone contract instance
     * @param _subject The subject or question of the vote
     * @param _topic The topic of the vote
     * @param _choices The different choices for this vote
     */
    function init(IERC20Metadata _DPS, VotingDelegation _proxy, BallotFactory _factory, string memory _subject, string memory _topic, string[] memory _choices) public initializer {
        subject = _subject;
        topic = _topic;
        closed = false;
        choices = _choices;
        resultStorage = new uint256[](choices.length);
        DPS = _DPS;
        proxy = _proxy;
        factory = _factory;
    }

    /**
     * @notice Returns all choices of the vote
     */
    function getChoices() external view returns(string[] memory) {
        return choices;
    }

    /**
     * @notice Returns all results of the vote.
     * @dev Available only once the vote has been closed.
     */
    function getResults() external view returns (uint256[] memory) {
        return resultStorage;
    }

    /**
     * @notice Send vote for given choice.
     * @dev Requirements:
     * - Vote MUST be open.
     * - Choice MUST be available in the choices array.
     * - Voter MUST NOT have delegated his vote.
     * - Voter MUST have at least 25k DPS.
     * @param choiceIndex the index of the selected choice in the choices array
     */
    function vote(uint32 choiceIndex) external {
        require(!closed, "Voting: Ballot is closed.");
        require(choices.length > choiceIndex, "Voting: Choice index is too high.");

        require(!proxy.hasDelegated(msg.sender,topic), "Voting: Vote is delegated."); // Verify that voter has not granted proxy to somebody.

        require(DPS.balanceOf(msg.sender) >= votingLimit, "Voting: Not enough DPS to vote."); // 25k DPS limit

        if(!votes[msg.sender].hasVoted) {
            votes[msg.sender].hasVoted = true;
            voters.push(msg.sender);
        }

        votes[msg.sender].choiceIndex = choiceIndex;
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
            resultStorage[votes[voter].choiceIndex] += DPS.balanceOf(voter) + proxy.delegationAmount(voter, topic);
        }
    }


}
