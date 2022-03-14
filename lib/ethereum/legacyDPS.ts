import { Contract } from 'ethers';
import SquareFundRaiserABI from '../abi/SquareFundRaiser.abi.json';
import IERC20 from '../types/openzeppelin/IERC20';
import Ownable from '../types/openzeppelin/Ownable';
import ethereum from './ethereum';

/** @type {string} The legacy DPS contract on the Ethereum blockchain. */
const LEGACY_DPS = '0x8DFFCD9a2F392451e0cE7A1F0D73D65C5807ECd3';

const legacyDPS = new Contract(LEGACY_DPS, SquareFundRaiserABI, ethereum) as IERC20 & Ownable;

export default legacyDPS;
