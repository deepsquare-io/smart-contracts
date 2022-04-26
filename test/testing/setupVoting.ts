import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Ballot } from '../../typings/contracts/Ballot';
import { DeepSquare } from '../../typings/contracts/DeepSquare';
import { VotingDelegation } from '../../typings/contracts/VotingDelegation';
import { BallotFactory } from '../../typings/contracts/factories/BallotFactory';
import { Ballot__factory } from '../../typings/factories/contracts/Ballot__factory';
import { VotingDelegation__factory } from '../../typings/factories/contracts/VotingDelegation__factory';
import { BallotFactory__factory } from '../../typings/factories/contracts/factories/BallotFactory__factory';

interface SetupVotingOutput {
  votingDelegation: VotingDelegation;
  ballotImplementation: Ballot;
  ballotFactory: BallotFactory;
}

export default async function setupVoting(owner: SignerWithAddress, DPS: DeepSquare): Promise<SetupVotingOutput> {
  const votingDelegation = await new VotingDelegation__factory(owner).deploy(DPS.address);
  const ballotImplementation = await new Ballot__factory(owner).deploy(DPS.address, votingDelegation.address);
  const ballotFactory = await new BallotFactory__factory(owner).deploy(DPS.address, ballotImplementation.address);

  return {
    votingDelegation,
    ballotImplementation,
    ballotFactory,
  };
}
