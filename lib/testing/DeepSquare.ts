import { ethers } from 'hardhat';
import { createERC20Agent } from './ERC20';

export async function setupDeepSquare() {
  const [owner, ...accounts] = await ethers.getSigners();

  const Security = await (await ethers.getContractFactory('SpenderSecurity')).deploy();
  const DPS = await (await ethers.getContractFactory('DeepSquare')).deploy(Security.address);
  const agentDPS = await createERC20Agent(DPS);

  return {
    owner,
    accounts,
    Security,
    DPS,
    agentDPS,
  };
}
