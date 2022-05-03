import { ethers, network } from 'hardhat';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { BallotFactory__factory } from '../typings/factories/contracts/voting/BallotFactory__factory';
import { Ballot__factory } from '../typings/factories/contracts/voting/Ballot__factory';
import { VotingDelegation__factory } from '../typings/factories/contracts/voting/VotingDelegation__factory';
import waitTx from "../lib/waitTx";
import {BigNumber} from "@ethersproject/bignumber";

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'DeepSquare';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x270D1399744874C72f95873eB9606172D155669D',
  },
};

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer, dpsHolder, ...accounts] = await ethers.getSigners();

  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);

  const gnosisAddress = await DeepSquare.owner();

  const proxy = new VotingDelegation__factory(deployer).attach('0x0C7a9a7eBd57Fc9e0afbeed697CF1eFa0C5B6F79');

  console.log('deployer:', deployer.address);
  console.log('gnosis:', gnosisAddress);
  const ballotFactory = await new BallotFactory__factory(deployer).attach('0x6f872A3579C7Cf1439Ef25e53E9Cd00f2bB4B13F');
  console.log('ballotFactory:', ballotFactory.address);
  const ballot = await new Ballot__factory(deployer).attach('0x1CFC93D985844673cd9298A6725Ac9B0EE57Cca5');
  //
  // console.log('Vote is', (await ballot.closed()) ? 'closed' : 'open');
  //
  // console.log(
  //   'Voter has',
  //   (await proxy.hasDelegated(deployer.address, await ballot.topic()))
  //     ? 'delegated his vote'
  //     : 'not delegated his vote',
  // );
  //
  // console.log(await ballot.getChoices());
  //
  // console.log('Voter has', (await DeepSquare.balanceOf(deployer.address)).div(1e9).div(1e9).toString(), 'DPS');
  //
  //
  // await waitTx(ballot.vote(BigNumber.from(0)));

  // await waitTx(
  //   ballotFactory
  //     .connect(dpsHolder)
  //     .createBallot('Is the test deployment working properly ?', 'testing', ['Yes', 'No']),
  // );
  console.log(await ballot.getResults());
  // console.log(await ballot.getVote(deployer.address));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
