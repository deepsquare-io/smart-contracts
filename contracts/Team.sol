// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Transfer.sol";

contract Team is Transfer {
    constructor(
    IERC20Metadata _DPS,
    IERC20Metadata _STC,
    Eligibility _eligibility,
    uint8 _rate
    ) Transfer (
        _DPS,
        _STC,
        _eligibility,
        _rate
    ) {}
}
