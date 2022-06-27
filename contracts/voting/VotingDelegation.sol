// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./BallotFactory.sol";

/**
 * @title BallotFactory
 * @author Mathieu Bour, Valentin Pollart, Clarisse Tarrou and Charly Mancel for the DeepSquare Association.
 * @dev Implementation of vote delegation contract for a voting feature
 */
contract VotingDelegation is Ownable {
    // @dev Contract defining the DPS token
    IERC20Metadata public DPS;

    struct Grants {
        mapping(address => uint256) indexes;
        address[] delegators;
    }

    // @dev The minimum amount of DPS a user must have to receive vote delegations (25k DPS)
    uint256 immutable delegatingLimit = 25e3 * 1e18;

    // @dev A list of delegations received by a user user per topic
    mapping(address => mapping(bytes32 => Grants)) internal delegates; // representative => tag => delegators

    // @dev The representative of a user per topic
    mapping(address => mapping(bytes32 => address)) internal proxyVoters; // delegator => tag => representative

    /**
     * @param _DPS The DPS contract address
     */
    constructor(IERC20Metadata _DPS) {
        require(address(_DPS) != address(0), "VotingDelegation: DPS address is zero.");

        DPS = _DPS;
    }

    /**
     * @notice Give delegation to another user on a topic. The representative MUST either have at least 25k DPS or be the zero address (which correspond to removing the delegation)
     * @param to The user to give delegation to
     * @param topic The topic on which you give delegation
     */
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

    /**
     * @notice Computes the vote power a user have on a topic through delegation
     * @dev The total does not include the user own vote power
     * @param voter The address of the voter
     * @param topic The delegation topic
     */
    function delegationAmount(address voter, bytes32 topic) public view returns (uint256) {
        uint256 total;
        for(uint32 i = 0; i < delegates[voter][topic].delegators.length; i++) {
            total += DPS.balanceOf(delegates[voter][topic].delegators[i]);
        }
        return total;
    }

    /**
     * @notice Returns whether or not the voter has given delegation on given topic
     * @param voter The address of the voter
     * @param topic The delegation topic
     */
    function hasDelegated(address voter, bytes32 topic) external view returns (bool) {
        return proxyVoters[voter][topic] != address(0);
    }

    /**
     * @notice Returns all delegations a voter has on a given topic
     * @param to The address of the voter
     * @param topic The delegation topic
     */
    function delegators(address to, string memory topic) external view returns(address[] memory) {
        bytes32 topicHash = keccak256(bytes(topic));
        address[] memory proxies = new address[](delegates[to][topicHash].delegators.length);
        for(uint32 i = 0; i < delegates[to][topicHash].delegators.length; i++) {
            proxies[i] = delegates[to][topicHash].delegators[i];
        }
        return proxies;
    }

    /**
     * @notice Returns the address of the representative of a voter has on a given topic
     * @param from The address of the voter
     * @param topic The delegation topic
     */
    function representative(address from, string memory topic) external view returns(address) {
        return proxyVoters[from][keccak256(bytes(topic))];
    }
}
