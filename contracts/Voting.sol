pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Can a voter change his/her vote ? --> Yes
// Can a voter who grant proxy to somebody can still vote ? Can s.he change proxy voter vote ? -->
// Can a proxy voter change original voter vote ?
// Is there a limit of delegate votes per proxy voters ?
// Can a voter grant proxy to more than one person on a given tag ?

// If A grant proxy to B, and if A and B call vote and reach the vote verification simultaneously, both A and B might register a vote for A
// ==> Could be solved by registering voters address instead of incrementing a count, but scales badly.

// Currently, order is not kept for tags, causing index issues, 2 solutions :
//  - remove reference to tag index and use value => forces to check each time there's a reference to a tag to verify it is a member of tag list.
//  - do not change indexes at tag removal => residual value (such as empty string) will be left in the tag list.
// ==> Should owner even be able to remove a tag ?

// TODO: Verify if the voter has enough DPS to vote. (25k DPS)

contract Voting is Ownable {
    string[] public tags;

    struct Proposal {
        string statement;
        uint32 votes;
    }

    struct Ballot {
        string subject;
        bool closed;
        uint32 tagIndex;
        uint32 proposalCount;

    }

    struct Grant {
        address voter;
        uint256 amount;
    }

    Ballot[] public ballots;

    Proposal[][] public choices;

    uint32[][] private results;

    mapping(uint32 => mapping(address => bool)) hasVoted;

    mapping(address => mapping(uint32 => Grant[])) private delegates; // proxy => tag => {voter, amount}[]

    mapping(address => mapping(uint32 => Grant[])) private proxyVoters; // voter => tag => {proxy, amount}[]

    function addTag(string memory name) external onlyOwner {
        tags.push(name);
    }

    function removeTag(uint32 tagIndex) external onlyOwner {
        require(tags.length > tagIndex, 'Voting: Tag index is too high.');
        tags[tagIndex] = tags[tags.length - 1];
        tags.pop();
    }

    function createBallot(string memory subject, uint32 tagIndex, Proposal[] memory proposals) external onlyOwner {
        require(tags.length > tagIndex, 'Voting: Tag index is too high.');
        Ballot memory ballot = Ballot(subject, false, tagIndex, proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            ballot.proposals[i] = proposals[i];
        }
        ballots.push(ballot);
    }

    function closeBallot(uint32 ballotIndex) external onlyOwner {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        ballots[ballotIndex].closed = true;
    }


    function vote(uint32 ballotIndex, uint32 proposalIndex) external {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        require(!ballots[ballotIndex].closed, 'Voting: Ballot is closed.');
        require(ballots[ballotIndex].proposals.length > proposalIndex, 'Voting: Proposal index is too high.');

        // A donne délégation à B

        if (!hasVoted[ballotIndex][msg.sender]) { // A n'a pas déjà voté
            hasVoted[ballotIndex][msg.sender] = true;
            results[ballotIndex][proposalIndex] ++; // sender vote
        }


        address[] memory _delegates = delegates[msg.sender][ballots[ballotIndex].tagIndex];
        for (uint i = 0; i < _delegates.length; i++) {
            if(!hasVoted[ballotIndex][_delegates[i]]) { // A n'a pas déjà voté
                hasVoted[ballotIndex][_delegates[i]] = true;
                results[ballotIndex][proposalIndex] ++;  // proxy vote
            }
        }
    }

    function grantProxy(address to, uint32 tagIndex) external {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');

        proxyVoters[msg.sender][tagIndex] = to;
        delegates[to][tagIndex].push(msg.sender);
    }

    function removeProxy(uint32 tagIndex) external {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');
        require(proxyVoters[msg.sender][tagIndex] != address(0), 'Voting: No grant given for this tag.');

        address proxy = proxyVoters[msg.sender][tagIndex];
        proxyVoters[msg.sender][tagIndex] = address(0);

        address[] memory grants = delegates[proxy][tagIndex];
        for (uint i = 0; i < grants.length; i++) {
            if(grants[i] == msg.sender) {
                delegates[proxy][tagIndex][i] = delegates[proxy][tagIndex][grants.length- 1];
                delegates[proxy][tagIndex].pop();
                return;
            }
        }
    }

    function showResults(uint32 ballotIndex) external view returns(uint32[] memory) {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high');
        require(ballots[ballotIndex].closed, 'Voting: Ballot is still open.');
        return results[ballotIndex];
    }
}
