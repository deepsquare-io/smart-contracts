import { ethers } from 'hardhat';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZERO_ADDRESS } from '../../lib/constants';
import { DeepSquare } from '../../typings/contracts/DeepSquare';
import { LockingSecurity } from '../../typings/contracts/LockingSecurity';
import { DeepSquare__factory } from '../../typings/factories/contracts/DeepSquare__factory';
import { LockingSecurity__factory } from '../../typings/factories/contracts/LockingSecurity__factory';
import { createERC20Agent, ERC20Agent } from './ERC20Agent';

interface SetupOutput {
  owner: SignerWithAddress;
  accounts: SignerWithAddress[];
  Security: LockingSecurity;
  DPS: DeepSquare;
  agentDPS: ERC20Agent;
}

/**
 * Set up the DeepSquare ERC-20 and its dependencies (SpenderSecurity).
 * @return {Promise<SetupOutput>}
 */
export default async function setup(): Promise<SetupOutput> {
  const [owner, ...accounts] = await ethers.getSigners();

  const DPS = await new DeepSquare__factory(owner).deploy(ZERO_ADDRESS);
  const Security = await new LockingSecurity__factory(owner).deploy(DPS.address);
  await DPS.setSecurity(Security.address);
  const agentDPS = await createERC20Agent(DPS);

  return {
    owner,
    accounts,
    Security,
    DPS,
    agentDPS,
  };
}
