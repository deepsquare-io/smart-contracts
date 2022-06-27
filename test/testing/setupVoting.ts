import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DeepSquare } from '../../typings/contracts/DeepSquare';
import { Ballot } from '../../typings/contracts/voting/Ballot';
import { BallotFactory } from '../../typings/contracts/voting/BallotFactory';
import { VotingDelegation } from '../../typings/contracts/voting/VotingDelegation';
import { BallotFactory__factory } from '../../typings/factories/contracts/voting/BallotFactory__factory';
import { Ballot__factory } from '../../typings/factories/contracts/voting/Ballot__factory';
import { VotingDelegation__factory } from '../../typings/factories/contracts/voting/VotingDelegation__factory';

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
