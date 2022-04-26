// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./VotingDelegation.sol";

contract Ballot is Ownable, Initializable {
    IERC20Metadata public DPS;
    VotingDelegation public proxy;
    BallotFactory public factory;

    struct Vote {
        uint32 choiceIndex;
        bool hasVoted;
    }

    string public subject;
    bool public closed;
    string public topic;
    string[] public choices;
    uint256[] public resultStorage;
    uint256 immutable votingLimit = 25e3 * 1e18;

    address[] internal voters;
    mapping(address => Vote) internal votes;

    constructor(
        IERC20Metadata _DPS,
        VotingDelegation _proxy
    ) {
        require(address(_DPS) != address(0), "Vote: DPS address is zero.");
        DPS = _DPS;
        proxy = _proxy;
    }

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

    function getChoices() external view returns(string[] memory) {
        return choices;
    }

    function getResults() external view returns (uint256[] memory) {
        return resultStorage;
    }

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
