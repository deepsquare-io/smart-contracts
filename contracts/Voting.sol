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

    Result[] internal results;

    uint256[][] public resultStorage;

    mapping(address => mapping(uint32 => Grants)) internal delegates; // proxy => tag => voters

    mapping(address => mapping(uint32 => address)) internal proxyVoters; // voter => tag => proxy

    constructor(
        IERC20Metadata _DPS
    ) {
        require(address(_DPS) != address(0), "Vote: DPS address is zero.");

        DPS = _DPS;
    }

    function addTag(string memory name) external onlyOwner {
        tags.push(name);
    }

    function getTags() external view returns(string[] memory){
        return tags;
    }

    function createBallot(string memory subject, uint32 tagIndex, string[] memory _choices) external onlyOwner {
        require(tags.length > tagIndex, 'Voting: Tag index is too high.');

        ballots.push(Ballot(subject, false, tagIndex));
        choices.push(_choices);
        results.push();
        resultStorage.push();
        for(uint i = 0; i < _choices.length; i++){
            resultStorage[resultStorage.length - 1].push(0);
        }
    }

    function getBallots() external view returns(Ballot[] memory) {
        return ballots;
    }

    function getChoices() external view returns(string[][] memory) {
        return choices;
    }

    function getAllResults() external view returns (uint256[][] memory) {
        return resultStorage;
    }

    function getBallotResult(uint256 ballotIndex) external view returns(uint256[] memory) {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        return resultStorage[ballotIndex];
    }

    function vote(uint32 ballotIndex, uint32 choiceIndex) external {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        require(!ballots[ballotIndex].closed, 'Voting: Ballot is closed.');
        require(choices[ballotIndex].length > choiceIndex, 'Voting: Choice index is too high.');

        require(proxyVoters[msg.sender][ballots[ballotIndex].tagIndex] == address(0), 'Voting: Vote is delegated.'); // Verify that voter has not granted proxy to somebody.
        require(DPS.balanceOf(msg.sender) >= 25e3 * 1e18, 'Voting: Not enough DPS to vote.'); // 25k DPS limit

        if(!results[ballotIndex].votes[msg.sender].hasVoted) {
            results[ballotIndex].votes[msg.sender].hasVoted = true;
            results[ballotIndex].voters.push(msg.sender);
        }

        results[ballotIndex].votes[msg.sender].choiceIndex = choiceIndex;
    }

    function totalProxyAmount(address voter, uint32 tagIndex) public view returns (uint256) {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');
        uint256 total = DPS.balanceOf(voter);
        for(uint32 i = 0; i < delegates[voter][tagIndex].grantCount; i++) {
            total += DPS.balanceOf(delegates[voter][tagIndex].indexVoter[i]);
        }
        return total;
    }

    function closeBallot(uint32 ballotIndex) external onlyOwner {
        require(ballots.length > ballotIndex, 'Voting: Ballot index is too high.');
        require(!ballots[ballotIndex].closed, 'Voting: Ballot already closed.');

        ballots[ballotIndex].closed = true;

        Result storage result = results[ballotIndex];
        uint32 tagIndex = ballots[ballotIndex].tagIndex;

        for(uint i = 0; i < result.voters.length; i++) { // if A has granted proxy to B
            address voter = result.voters[i];
            resultStorage[ballotIndex][result.votes[voter].choiceIndex] += totalProxyAmount(voter, tagIndex);
        }
    }

    function grantProxy(address to, uint32 tagIndex) external {
        require(tags.length > tagIndex, 'Voting: Tag index is too high');
        require(DPS.balanceOf(to) >= 25e3 * 1e18 || to == address(0), 'Voting: Proxy has not enough DPS.');

        if(proxyVoters[msg.sender][tagIndex] != address(0)) {
            Grants storage formerDelegateGrants = delegates[proxyVoters[msg.sender][tagIndex]][tagIndex];
            uint32 senderIndex = formerDelegateGrants.voterIndex[msg.sender];
            formerDelegateGrants.indexVoter[senderIndex] = formerDelegateGrants.indexVoter[formerDelegateGrants.grantCount - 1];
            formerDelegateGrants.indexVoter[formerDelegateGrants.grantCount - 1] = address(0);
            formerDelegateGrants.voterIndex[msg.sender] = 0;
            formerDelegateGrants.grantCount--;
        }
        
        proxyVoters[msg.sender][tagIndex] = to;

        if(to != address(0)) {
            Grants storage newDelegateGrants = delegates[to][tagIndex];
            newDelegateGrants.voterIndex[msg.sender] = newDelegateGrants.grantCount;
            newDelegateGrants.indexVoter[newDelegateGrants.grantCount] = msg.sender;
            newDelegateGrants.grantCount++;
        }
    }
}
