// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * @title ERC20Ownable
 * @author Mathieu Bour
 * @notice Provide a ERC20 contract that is Ownable.
 */
abstract contract ERC20Ownable is ERC20, Ownable {

}
