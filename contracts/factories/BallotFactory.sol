// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../Ballot.sol";
import "../VotingProxy.sol";
import "../BallotTagManager.sol";

contract BallotFactory is Ownable {
    address[] public ballotAddresses;
    address public implementationAddress;
    BallotTagManager public ballotTagManager;

    event BallotCreated(address ballotAddress);

    constructor(address _implementationAddress, BallotTagManager _ballotTagManager){
        require(_implementationAddress != address(0), "BallotFactory: Implementation address should not be zero address");
        require(address(_ballotTagManager) != address(0), "BallotFactory: Ballot tag manager address should not be zero address");
        implementationAddress = _implementationAddress;
        ballotTagManager = _ballotTagManager;
    }

    function createBallot(string memory subject, uint32 tagIndex, string[] memory _choices) external onlyOwner {
        require(ballotTagManager.getTags().length > tagIndex, "BallotFactory: Tag index is too high.");

        address cloneAddress = Clones.clone(implementationAddress);
        Ballot(cloneAddress).init(subject, tagIndex, _choices);

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
