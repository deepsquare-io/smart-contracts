// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Ballot.sol";

contract ExposedBallot is Ballot {

    constructor(IERC20Metadata _DPS, VotingDelegation _proxy) Ballot(_DPS, _proxy) {}

    struct ResultSample {
        address voter;
        Vote vote;
    }

    function _results() external view returns(ResultSample[] memory) {
        ResultSample[] memory samples = new ResultSample[](voters.length);
        for(uint i = 0; i < voters.length; i++) {
            samples[i] = ResultSample(voters[i], votes[voters[i]]);
        }
        return samples;
    }


}
