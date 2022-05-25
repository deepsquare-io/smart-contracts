import { ethers } from 'hardhat';

export default function time() {
  return {
    getCurrentTime: async (): Promise<number> => {
      return await ethers.provider.getBlock(await ethers.provider.getBlockNumber()).then((b) => b.timestamp);
    },
    setTime: async (duration: number) => {
      await ethers.provider.send('evm_mine', [duration]);
    },
  };
}
