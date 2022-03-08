import { ethers } from 'hardhat';
import { createERC20Agent } from './ERC20';

export async function setupDeepSquare() {
  const [owner, ...accounts] = await ethers.getSigners();

  const SecurityFactory = await ethers.getContractFactory('SpenderSecurity');
  const Security = await SecurityFactory.deploy();

  const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
  const DPS = await DeepSquareFactory.deploy(Security.address);
  const agentDPS = await createERC20Agent(DPS);

  return {
    owner,
    accounts,
    Security,
    DPS,
    agentDPS,
  };
}
