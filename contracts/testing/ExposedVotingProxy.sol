// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../VotingProxy.sol";

contract ExposedVotingProxy is VotingProxy {
    constructor(IERC20Metadata _DPS, BallotTagManager _ballotTagManager) VotingProxy(_DPS, _ballotTagManager) {}

    function _delegates(address to, uint32 tagIndex) external view returns(address[] memory) {
        address[] memory proxies = new address[](delegates[to][tagIndex].grantCount);
        for(uint32 i = 0; i < delegates[to][tagIndex].grantCount; i++) {
            proxies[i] = delegates[to][tagIndex].indexVoter[i];
        }
        return proxies;
    }

    function _proxyVoters(address from, uint32 tagIndex) external view returns(address) {
        return proxyVoters[from][tagIndex];
    }
}
