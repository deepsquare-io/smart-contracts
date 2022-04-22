// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./VotingProxy.sol";

// Can a voter change his/her vote ? --> Yes
// Can a voter who grant proxy to somebody can still vote ? --> No
// Can s.he change proxy voter vote ? -->
// Can a proxy voter change original voter vote ?
// Is there a limit of delegate votes per proxy voters ?
// Can a voter grant proxy to more than one person on a given tag ?
// Do we need to have a started flag so admins can create a vote and start it afterwards ? --> No

// Can a voter delegate to a voter that has less than 25k DPS ? --> No
// Is the 25k DPS limit for delegating balance DPS or undelegated DPS ? --> DPS balance

// If A grant proxy to B, and if A and B call vote and reach the vote verification simultaneously, both A and B might register a vote for A
// ==> Could be solved by registering voters address instead of incrementing a count, but scales badly.

// Currently, order is not kept for tags, causing index issues, 2 solutions :
//  - remove reference to tag index and use value => forces to check each time there's a reference to a tag to verify it is a member of tag list.
//  - do not change indexes at tag removal => residual value (such as empty string) will be left in the tag list.
// ==> Should owner even be able to remove a tag ?

// Is granting recursive (if A grants proxy to B and B to C, does C has voting power of B+C or A+B+C ?)

// Add/remove choices ?

// A a voté 1
// B a voté 2

// voters = address[]
// mapping(address => uint32) results
// results[C] == 0

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

    function init(string memory _subject, uint32 _tagIndex, string[] memory _choices, VotingProxy _proxy) public initializer {
        subject = _subject;
        tagIndex = _tagIndex;
        closed = false;
        choices = _choices;
        proxy = _proxy;
        resultStorage = new uint256[](choices.length);
    }

    function getChoices() external view returns(string[] memory) {
        return choices;
    }

    function getResults() external view returns (uint256[] memory) {
        return resultStorage;
    }

    function vote(uint32 choiceIndex) external {
        require(!closed, 'Voting: Ballot is closed.');
        require(choices.length > choiceIndex, 'Voting: Choice index is too high.');

        require(!proxy.hasDelegated(msg.sender,tagIndex), 'Voting: Vote is delegated.'); // Verify that voter has not granted proxy to somebody.

        require(DPS.balanceOf(msg.sender) >= 25e3 * 1e18, 'Voting: Not enough DPS to vote.'); // 25k DPS limit

        if(!votes[msg.sender].hasVoted) {
            votes[msg.sender].hasVoted = true;
            voters.push(msg.sender);
        }

        votes[msg.sender].choiceIndex = choiceIndex;
    }

    function closeBallot() external onlyOwner {
        require(!closed, 'Voting: Ballot already closed.');

        closed = true;

        for(uint i = 0; i < voters.length; i++) { // if A has granted proxy to B
            address voter = voters[i];
            resultStorage[votes[voter].choiceIndex] += DPS.balanceOf(voter) + proxy.proxyAmount(voter, tagIndex);
        }
    }


}
