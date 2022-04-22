// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./VotingProxy.sol";

contract Ballot is Ownable, Initializable {
    IERC20Metadata public immutable DPS;
    VotingProxy public proxy;

    struct Vote {
        uint32 choiceIndex;
        bool hasVoted;
    }

    string public subject;
    bool public closed;
    uint32 public tagIndex;
    string[] public choices;
    uint256[] public resultStorage;

    address[] internal voters;
    mapping(address => Vote) internal votes;

    constructor(
        IERC20Metadata _DPS,
        VotingProxy _proxy
    ) {
        require(address(_DPS) != address(0), "Vote: DPS address is zero.");
        DPS = _DPS;
        proxy = _proxy;
    }

    function init(string memory _subject, uint32 _tagIndex, string[] memory _choices) public initializer {
        subject = _subject;
        tagIndex = _tagIndex;
        closed = false;
        choices = _choices;
        resultStorage = new uint256[](choices.length);
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

        require(!proxy.hasDelegated(msg.sender,tagIndex), "Voting: Vote is delegated."); // Verify that voter has not granted proxy to somebody.

        require(DPS.balanceOf(msg.sender) >= 25e3 * 1e18, "Voting: Not enough DPS to vote."); // 25k DPS limit

        if(!votes[msg.sender].hasVoted) {
            votes[msg.sender].hasVoted = true;
            voters.push(msg.sender);
        }

        votes[msg.sender].choiceIndex = choiceIndex;
    }

    function closeBallot() external onlyOwner {
        require(!closed, "Voting: Ballot already closed.");

        closed = true;

        for(uint i = 0; i < voters.length; i++) { // if A has granted proxy to B
            address voter = voters[i];
            resultStorage[votes[voter].choiceIndex] += DPS.balanceOf(voter) + proxy.proxyAmount(voter, tagIndex);
        }
    }


}
