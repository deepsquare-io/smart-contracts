// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../Ballot.sol";
import "../VotingDelegation.sol";

contract BallotFactory is Ownable {
    address[] public ballotAddresses;
    address public implementationAddress;

    event BallotCreated(address ballotAddress);

    constructor(address _implementationAddress){
        require(_implementationAddress != address(0), "BallotFactory: Implementation address should not be zero address");
        implementationAddress = _implementationAddress;
    }

    function createBallot(string memory subject, string memory topic, string[] memory _choices) external onlyOwner {
        address cloneAddress = Clones.clone(implementationAddress);
        Ballot(cloneAddress).init(subject, topic, _choices);

        ballotAddresses.push(cloneAddress);
        emit BallotCreated(cloneAddress);
    }

    function setImplementationAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "BallotFactory: Implementation address should not be zero address");
        implementationAddress = newAddress;
    }

    function getBallots() external view returns (address[] memory) {
        return ballotAddresses;
    }
}
