import { ethers } from 'hardhat';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DeepSquare } from '../../typings/contracts/DeepSquare';
import { SpenderSecurity } from '../../typings/contracts/SpenderSecurity';
import { DeepSquare__factory } from '../../typings/factories/contracts/DeepSquare__factory';
import { SpenderSecurity__factory } from '../../typings/factories/contracts/SpenderSecurity__factory';
import { createERC20Agent, ERC20Agent } from './ERC20Agent';

interface SetupOutput {
  owner: SignerWithAddress;
  accounts: SignerWithAddress[];
  Security: SpenderSecurity;
  DPS: DeepSquare;
  agentDPS: ERC20Agent;
}
/**
 * Set up the DeepSquare ERC-20 and its dependencies (SpenderSecurity).
 * @return {Promise<SetupOutput>}
 */
export default async function setup(): Promise<SetupOutput> {
  const [owner, ...accounts] = await ethers.getSigners();

  const Security = await new SpenderSecurity__factory(owner).deploy();
  const DPS = await new DeepSquare__factory(owner).deploy(Security.address);
  const agentDPS = await createERC20Agent(DPS);

  return {
    owner,
    accounts,
    Security,
    DPS,
    agentDPS,
  };
}
