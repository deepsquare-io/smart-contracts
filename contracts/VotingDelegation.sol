// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./factories/BallotFactory.sol";

contract VotingDelegation is Ownable {
    IERC20Metadata public immutable DPS;
    BallotFactory public ballotFactory;

    struct Grants {
        mapping(address => uint256) indexes;
        address[] delegators;
    }

    uint256 immutable delegatingLimit = 25e3 * 1e18;

    mapping(address => mapping(bytes32 => Grants)) internal delegates; // proxy => tag => voters

    mapping(address => mapping(bytes32 => address)) internal proxyVoters; // voter => tag => proxy

    constructor(IERC20Metadata _DPS) {
        require(address(_DPS) != address(0), "VotingDelegation: DPS address is zero.");

        DPS = _DPS;
    }

    function delegate(address to, string memory topic) external {
        require(DPS.balanceOf(to) >= delegatingLimit || to == address(0), "VotingDelegation: Proxy has not enough DPS.");
        bytes32 topicHash = keccak256(bytes(topic));

        if(proxyVoters[msg.sender][topicHash] != address(0)) {
            Grants storage formerDelegateGrants = delegates[proxyVoters[msg.sender][topicHash]][topicHash];
            uint256 senderIndex = formerDelegateGrants.indexes[msg.sender];
            formerDelegateGrants.delegators[senderIndex] = formerDelegateGrants.delegators[formerDelegateGrants.delegators.length - 1];
            formerDelegateGrants.delegators.pop();
            formerDelegateGrants.indexes[msg.sender] = 0;
        }

        proxyVoters[msg.sender][topicHash] = to;

        if(to != address(0)) {
            Grants storage newDelegateGrants = delegates[to][topicHash];
            newDelegateGrants.indexes[msg.sender] = newDelegateGrants.delegators.length;
            newDelegateGrants.delegators.push(msg.sender);
        }
    }

    function delegationAmount(address voter, string memory topic) public view returns (uint256) {
        uint256 total;
        bytes32 topicHash = keccak256(bytes(topic));
        for(uint32 i = 0; i < delegates[voter][topicHash].delegators.length; i++) {
            total += DPS.balanceOf(delegates[voter][topicHash].delegators[i]);
        }
        return total;
    }

    function hasDelegated(address voter, string memory topic) external view returns (bool) {
        return proxyVoters[voter][keccak256(bytes(topic))] != address(0);
    }

    function delegators(address to, string memory topic) external view returns(address[] memory) {
        bytes32 topicHash = keccak256(bytes(topic));
        address[] memory proxies = new address[](delegates[to][topicHash].delegators.length);
        for(uint32 i = 0; i < delegates[to][topicHash].delegators.length; i++) {
            proxies[i] = delegates[to][topicHash].delegators[i];
        }
        return proxies;
    }

    function representative(address from, string memory topic) external view returns(address) {
        return proxyVoters[from][keccak256(bytes(topic))];
    }
}
