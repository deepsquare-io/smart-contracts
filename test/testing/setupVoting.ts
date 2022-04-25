import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  Ballot,
  Ballot__factory,
  BallotFactory,
  BallotFactory__factory,
  DeepSquare,
  VotingDelegation,
  VotingDelegation__factory,
} from '../../typings';

interface SetupVotingOutput {
  votingDelegation: VotingDelegation;
  ballotImplementation: Ballot;
  ballotFactory: BallotFactory;
}

export default async function setupVoting(owner: SignerWithAddress, DPS: DeepSquare): Promise<SetupVotingOutput> {
  const votingDelegation = await new VotingDelegation__factory(owner).deploy(DPS.address);
  const ballotImplementation = await new Ballot__factory(owner).deploy(DPS.address, votingDelegation.address);
  const ballotFactory = await new BallotFactory__factory(owner).deploy(ballotImplementation.address);

  return {
    votingDelegation,
    ballotImplementation,
    ballotFactory,
  };
}
