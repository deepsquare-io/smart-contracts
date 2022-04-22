// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./factories/BallotFactory.sol";

contract VotingProxy is Ownable {
    IERC20Metadata public immutable DPS;
    BallotFactory public ballotFactory;
    BallotTagManager public ballotTagManager;

    struct Grants {
        mapping(address => uint32) voterIndex;
        mapping(uint32 => address) indexVoter;
        uint32 grantCount;
    }

    mapping(address => mapping(uint32 => Grants)) internal delegates; // proxy => tag => voters

    mapping(address => mapping(uint32 => address)) internal proxyVoters; // voter => tag => proxy

    constructor(IERC20Metadata _DPS, BallotTagManager _ballotTagManager) {
        require(address(_DPS) != address(0), "VotingProxy: DPS address is zero.");
        require(address(_ballotTagManager) != address(0), 'VotingProxy: Ballot tag manager address is zero.');

        DPS = _DPS;
        ballotTagManager = _ballotTagManager;
    }

    function grantProxy(address to, uint32 tagIndex) external {
        require(ballotTagManager.getTags().length > tagIndex, 'VotingProxy: Tag index is too high');
        require(DPS.balanceOf(to) >= 25e3 * 1e18 || to == address(0), 'VotingProxy: Proxy has not enough DPS.');

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

    function proxyAmount(address voter, uint32 tagIndex) public view returns (uint256) {
        require(ballotTagManager.getTags().length > tagIndex, 'VotingProxy: Tag index is too high');
        uint256 total;
        for(uint32 i = 0; i < delegates[voter][tagIndex].grantCount; i++) {
            total += DPS.balanceOf(delegates[voter][tagIndex].indexVoter[i]);
        }
        return total;
    }

    function hasDelegated(address voter, uint32 tagIndex) external view returns (bool) {
        return proxyVoters[voter][tagIndex] != address(0);
    }
}
