import { ethers } from 'hardhat';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import DeepSquare from '../../typings/DeepSquare';
import SpenderSecurity from '../../typings/SpenderSecurity';
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

  const Security = (await (await ethers.getContractFactory('SpenderSecurity')).deploy()) as unknown as SpenderSecurity;
  const DPS = (await (await ethers.getContractFactory('DeepSquare')).deploy(Security.address)) as unknown as DeepSquare;
  const agentDPS = await createERC20Agent(DPS);

  return {
    owner,
    accounts,
    Security,
    DPS,
    agentDPS,
  };
}
