// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Ballot.sol";
import "./VotingDelegation.sol";

/**
 * @title BallotFactory
 * @author Mathieu Bour, Valentin Pollart, Clarisse Tarrou and Charly Mancel for the DeepSquare Association.
 * @dev Implementation of ballot factory, accordingly to EIP 1167 nomenclature for minimal proxy implementation
 */
contract BallotFactory is Ownable {
    // @dev Contract defining the DPS token
    IERC20Metadata public DPS;

    // @dev The list of all active ballot contract clones
    address[] public activeBallotAddresses;

    // @dev The list of all archived ballot contract clones
    address[] public archivedBallotAddresses;

    // @dev The address of the ballot implementation used as ballot contract proxy
    address public implementationAddress;

    /**
     * @dev Event fired each time a ballot contract clone is created
     * @param ballotAddress The address of the created clone contract
     */
    event BallotCreated(address ballotAddress);

    /**
     * @param _DPS The DPS contract address
     * @param _implementationAddress The ballot contract proxy address
     */
    constructor(IERC20Metadata _DPS, address _implementationAddress){
        require(address(_DPS) != address(0), "BallotFactory: Implementation address should not be zero address");
        require(_implementationAddress != address(0), "BallotFactory: Implementation address should not be zero address");
        DPS = _DPS;
        implementationAddress = _implementationAddress;
    }

    /**
     * @notice Creates a new ballot contract clone
     * @param subject The subject or question of the vote
     * @param topic The topic of the vote
     * @param choices The different choices for this vote
     */
    function createBallot(string memory subject, string memory topic, string[] memory choices) external onlyOwner {
        Ballot implementation = Ballot(implementationAddress);
        address cloneAddress = Clones.clone(implementationAddress);
        Ballot(cloneAddress).init(implementation.DPS(), implementation.proxy(), this, subject, topic, choices);
        activeBallotAddresses.push(cloneAddress);
        emit BallotCreated(cloneAddress);
    }

    /**
     * @notice Archive a ballot and remove it from the active ballot list
     * @dev It can be perform only by the ballot itself by calling this method within its close method.
     */
    function archiveBallot() external {
        bool isBallotContract = false;
        for(uint i = 0; i < activeBallotAddresses.length; i++) {
            if (activeBallotAddresses[i] == msg.sender) {
                isBallotContract = true;
                archivedBallotAddresses.push(activeBallotAddresses[i]);
                activeBallotAddresses[i] = activeBallotAddresses[activeBallotAddresses.length - 1];
                activeBallotAddresses.pop();
                return;
            }
        }
    }

    /**
     * @notice Set up the new ballot proxy address
     * @param newAddress The address of the new ballot proxy contract
     */
    function setImplementationAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "BallotFactory: Implementation address should not be zero address");
        implementationAddress = newAddress;
    }

    /**
     * @notice Returns all active ballot clone addresses.
     */
    function getActiveBallots() external view returns (address[] memory) {
        return activeBallotAddresses;
    }

    /**
     * @notice Returns all archived ballot clone addresses.
     */
    function getArchivedBallots() external view returns (address[] memory) {
        return archivedBallotAddresses;
    }
}
