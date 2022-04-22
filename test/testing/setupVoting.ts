import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  Ballot,
  Ballot__factory,
  BallotFactory,
  BallotFactory__factory,
  BallotTagManager,
  BallotTagManager__factory,
  DeepSquare,
  ExposedVotingProxy,
  ExposedVotingProxy__factory,
} from '../../typings';

interface SetupVotingOutput {
  ballotTagManager: BallotTagManager;
  votingProxy: ExposedVotingProxy;
  ballotImplementation: Ballot;
  ballotFactory: BallotFactory;
}

export default async function setupVoting(owner: SignerWithAddress, DPS: DeepSquare): Promise<SetupVotingOutput> {
  const ballotTagManager = await new BallotTagManager__factory(owner).deploy();
  const votingProxy = await new ExposedVotingProxy__factory(owner).deploy(DPS.address, ballotTagManager.address);
  const ballotImplementation = await new Ballot__factory(owner).deploy(DPS.address, votingProxy.address);
  const ballotFactory = await new BallotFactory__factory(owner).deploy(
    ballotImplementation.address,
    ballotTagManager.address,
  );

  return {
    ballotTagManager,
    votingProxy,
    ballotImplementation,
    ballotFactory,
  };
}
