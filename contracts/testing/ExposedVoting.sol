pragma solidity ^0.8.0;

import "../Voting.sol";

contract ExposedVoting is Voting {

    constructor(IERC20Metadata _DPS) Voting(_DPS) {}

    struct ResultSample {
        address voter;
        Vote vote;
    }

    function _results(uint256 index) external view returns(ResultSample[] memory) {
        ResultSample[] memory samples = new ResultSample[](results[index].voters.length);
        for(uint i = 0; i < results[index].voters.length; i++) {
            samples[i] = ResultSample(results[index].voters[i], results[index].votes[results[index].voters[i]]);
        }
        return samples;
    }

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
