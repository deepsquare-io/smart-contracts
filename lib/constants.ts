import { utils } from 'ethers';

/** @type BigInteger The 210 millions DPS total supply. */
export const DPS_TOTAL_SUPPLY = utils.parseUnits('210000000');

/** @type {string} The Ethereum zero address. */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
