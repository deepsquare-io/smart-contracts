// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BallotFactory is Ownable {
    address[] public ballotAddresses;
    address public masterAddress;

    string[] public tags;

    constructor(address _masterAddress){
        require(_masterAddress != address(0), 'BallotFactory: Master address should not be zero address');
        masterAddress = _masterAddress;
    }

    function createBallot(string memory subject, uint32 tagIndex, string[] memory _choices) external onlyOwner returns(address){
        require(tags.length > tagIndex, 'BallotFactory: Tag index is too high.');

        address cloneAddress;

        address master = masterAddress;

        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, master))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            cloneAddress := create(0, ptr, 0x37)
        }

        require(cloneAddress != address(0), "BallotFactory: Ballot clone creation failed");

        (bool success, ) = cloneAddress.call(abi.encodeWithSignature("init(string,uint32,string[])", subject, tagIndex, _choices));
        require(success, "BallotFactory: Ballot clone initialization failed.");

        ballotAddresses.push(cloneAddress);

        return cloneAddress;
    }

    function setMasterAddress(address newAddress) external onlyOwner {
        require(masterAddress != address(0), 'BallotFactory: Master address should not be zero address');
        masterAddress = newAddress;
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
