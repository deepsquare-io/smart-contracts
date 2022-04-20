pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

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

contract Voting is Ownable {
    IERC20Metadata public immutable DPS;

    string[] public tags;

    struct Ballot {
        string subject;
        bool closed;
        uint32 tagIndex;
        string[] choices;
    }

    struct Grants {
        mapping(address => uint32) voterIndex;
        mapping(uint32 => address) indexVoter;
        uint32 grantCount;
    }

    struct Vote {
        uint32 choiceIndex;
        bool hasVoted;
    }

    struct Result {
        address[] voters;
        mapping(address => Vote) votes;
    }

    Ballot[] public ballots;

    string[][] public choices;

    Result[] private results;

    mapping(uint32 => mapping(uint32 => uint256)) public resultStorage;

    mapping(address => mapping(uint32 => Grants)) private delegates; // proxy => tag => voters
    // proxyAddress => tagIndexA => [addressA1, addressA2, ... ]
    //              => tagIndexB => [addressB1, addressB2, ... ]

    mapping(address => mapping(uint32 => address)) private proxyVoters; // voter => tag => proxy

    constructor(
        IERC20Metadata _DPS
    ) {
        require(address(_DPS) != address(0), "Sale: token is zero");

        DPS = _DPS;
    }

    function addTag(string memory name) external onlyOwner {
        tags.push(name);
    }

    function removeTag(uint32 tagIndex) external onlyOwner {
        require(tags.length > tagIndex, 'Voting: Tag index is too high.');
        tags[tagIndex] = tags[tags.length - 1];
        tags.pop();
    }

    function createBallot(string memory subject, uint32 tagIndex, string[] memory _choices) external onlyOwner {
        require(tags.length > tagIndex, 'Voting: Tag index is too high.');

        uint32 memory ballotId = ballots.length;
        ballots.push(Ballot(subject, false, tagIndex));
        for (uint i = 0; i < _choices.length; i++) {
            choices[ballotId].push(_choices[i]);
        }

    }

    function closeBallot(uint32 ballotIndex) external onlyOwner {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        ballots[ballotIndex].closed = true;
    }


    function vote(uint32 ballotIndex, uint32 choiceIndex) external {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        require(!ballots[ballotIndex].closed, 'Voting: Ballot is closed.');
        require(choices[ballotIndex].length > choiceIndex, 'Voting: Choice index is too high.');

        require(proxyVoters[msg.sender][ballots[ballotIndex].tagIndex] == address(0), 'Voting: Vote is delegated.'); // Verify that voter has not granted proxy to somebody.
        require(DPS.balanceOf(msg.sender) > 25e3 * 1e18, 'Voting: Not enough DPS to vote.'); // 25k DPS limit

        if(!results[ballotIndex].votes[msg.sender].hasVoted) {
            results[ballotIndex].votes[msg.sender].hasVoted = true;
            results[ballotIndex].voters.push(msg.sender);
        }

        results[ballotIndex].votes[msg.sender].choiceIndex = choiceIndex;
    }

    function totalProxyAmount(address voter, uint32 tagIndex) public view returns (uint256) {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');
        uint256 memory total = DPS.balanceOf(voter);
        for(uint i = 0; i < delegates[voter][tagIndex].length; i++) {
            total += DPS.balanceOf(delegates[voter][tagIndex][i]);
        }
        return total;
    }

    function close(uint32 ballotIndex) external onlyOwner {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high');
        require(ballots[ballotIndex].closed, 'Voting: Ballot is still open.');

        ballots[ballotIndex].closed = true;

        Result memory result = results[ballotIndex];
        uint32 memory tagIndex= ballots[ballotIndex].tagIndex;

        for(uint i = 0; i < result.voters.length; i++) { // if A has granted proxy to B
            address memory voter = result.voters[i];
            resultStorage[ballotIndex][result.votes[voter].choiceIndex] = totalProxyAmount(voter, tagIndex);
        }
    }

    function grantProxy(address to, uint32 tagIndex) external {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');
        require(DPS.balanceOf(msg.sender) > 0, 'Voting: Not enough DPS to delegate.');
        require(DPS.balanceOf(to) > 25e3 * 1e18, 'Voting: Proxy has not enough DPS.');

        if(proxyVoters[msg.sender][tagIndex] != address(0)) {
            uint32 memory formerDelegate = delegates[proxyVoters[msg.sender][tagIndex]][tagIndex];
            uint32 memory senderIndex = formerDelegate.voterIndex[msg.sender];
            formerDelegate.indexVoter[senderIndex] = formerDelegate.indexVoter[formerDelegate.grantCount - 1];
            formerDelegate.indexVoter[formerDelegate.grantCount - 1] = address(0);
            formerDelegate.voterIndex[msg.sender] = -1;
            formerDelegate.grantCount--;
        }
        
        proxyVoters[msg.sender][tagIndex] = to;

        if(to != address(0)) {
            uint32 memory newDelegate = delegates[to][tagIndex];
            newDelegate.voterIndex[msg.sender] = newDelegate.grantCount;
            newDelegate.indexVoter[newDelegate.grantCount] = msg.sender;
            newDelegate.grantCount++;
        }
    }
}
