import { ethers } from 'hardhat';

export const ether = (amount: number) => ethers.utils.parseUnits(amount.toString(10));

export const usdc = (amount: number) => ethers.utils.parseUnits(amount.toString(10), 6);
