// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../Ballot.sol";
import "../VotingProxy.sol";

contract BallotFactory is Ownable {
    address[] public ballotAddresses;
    address public implementationAddress;
    address public votingProxyAddress;

    string[] public tags;

    constructor(address _implementationAddress, address _votingProxyAddress){
        require(_implementationAddress != address(0), 'BallotFactory: Implementation address should not be zero address');
        require(_votingProxyAddress != address(0), 'BallotFactory: Voting proxy address should not be zero address');
        implementationAddress = _implementationAddress;
        votingProxyAddress = _votingProxyAddress;
    }

    function createBallot(string memory subject, uint32 tagIndex, string[] memory _choices) external onlyOwner returns(address){
        require(tags.length > tagIndex, 'BallotFactory: Tag index is too high.');

        address cloneAddress = Clones.clone(implementationAddress);
        Ballot(cloneAddress).init(subject, tagIndex, _choices, VotingProxy(votingProxyAddress));

        ballotAddresses.push(cloneAddress);

        return cloneAddress;
    }

    function setImplementationAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), 'BallotFactory: Implementation address should not be zero address');
        implementationAddress = newAddress;
    }

    function getBallots() external view returns (address[] memory) {
        return ballotAddresses;
    }

    function getTags() external view returns(string[] memory) {
        return tags;
    }

    function addTag(string memory name) external onlyOwner {
        tags.push(name);
    }
}
