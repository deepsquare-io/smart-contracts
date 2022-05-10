// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Ballot.sol";
import "./VotingDelegation.sol";

/**
 * @title BallotFactory
 * @author Mathieu Bour, Valentin Pollart, Clarisse Tarrou and Charly Mancel for the DeepSquare Association.
 * @dev Implementation of ballot factory, accordingly to EIP 1167 nomenclature for minimal proxy implementation
 */
contract BallotFactory is Ownable, AccessControl {
    // @dev Contract defining the DPS token
    IERC20Metadata public DPS;

    // @dev The address of the ballot implementation used as ballot contract proxy
    address public implementationAddress;

    // @dev The closable role, granted to ballot clones created by this factory.
    bytes32 public constant CLOSABLE = keccak256("CLOSABLE");

    /**
     * @dev Event fired each time a ballot contract clone is created
     * @param ballotAddress The address of the created clone contract
     * @param title The title of the ballot
     * @param description The URL of the file containing the full description of the ballot
     * @param topic The topic of the ballot
     * @param choices The choices of the ballot
     */
    event BallotCreated(address ballotAddress, string title, string description, string topic, string[] choices);

    /**
     * @dev Event fired each time a ballot clone is closed
     * @param ballotAddress The address of the closed clone ballot
     */
    event BallotClosed(address ballotAddress);

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
     * @param title The title or question of the vote
     * @param description The description of the vote
     * @param topic The topic of the vote
     * @param choices The different choices for this vote
     */
    function createBallot(string memory title, string memory description, string memory topic, string[] memory choices) external onlyOwner {
        Ballot implementation = Ballot(implementationAddress);
        address cloneAddress = Clones.clone(implementationAddress);
        Ballot(cloneAddress).init(implementation.DPS(), implementation.proxy(), title, description, topic, choices);
        _grantRole(CLOSABLE, cloneAddress);
        emit BallotCreated(cloneAddress, title, description, topic, choices);
    }

    /**
     * @notice Archive a ballot and remove it from the active ballot list
     * @dev It can be perform only by the ballot itself by calling this method within its close method.
     */
    function archiveBallot() external onlyRole(CLOSABLE) {
        emit BallotClosed(msg.sender);
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
