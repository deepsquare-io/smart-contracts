import { id } from 'ethers/lib/utils';
import { ethers, network } from 'hardhat';
import waitTx from '../lib/waitTx';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { BallotFactory__factory } from '../typings/factories/contracts/voting/BallotFactory__factory';
import { Ballot__factory } from '../typings/factories/contracts/voting/Ballot__factory';
import { VotingDelegation__factory } from '../typings/factories/contracts/voting/VotingDelegation__factory';

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

  const proxy = new VotingDelegation__factory(deployer).attach('0x8a0DE2Bd6eCA72DfA85422cC113CE9D538aB582A');

  console.log('deployer:', deployer.address);
  console.log('gnosis:', gnosisAddress);
  const ballotFactory = await new BallotFactory__factory(deployer).attach('0x5B8dE5367E9b94bF3577F8675dfa50a1101c4DcA');
  console.log('ballotFactory:', ballotFactory.address);
  const ballot = await new Ballot__factory(deployer).attach('0x8a2F0e2b584d0e652cb6C75eb58a827EaE6341fb');
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
  //     .createBallot(
  //       'Is the test deployment working properly ?',
  //       'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  //       'testing',
  //       [
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //         'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  //         'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  //       ],
  //     ),
  // );
  // await waitTx(ballot.connect(dpsHolder).close());
  // console.log(await ballotFactory.getActiveBallots());
  // console.log(await DeepSquare.balanceOf('0x7aeac7429b348c8979a19DeA94D0cCfd888589c2'));
  // console.log(await ballot.resultStorage(id('Yes')));
  // console.log(await ballot.resultStorage(id('No')));
  // console.log(await proxy.representative('0x2FA6894875bb444e2e3f5911a557094FFCFc6638', 'Deployment'));
  console.log(await ballot.hasVoted('0x2FA6894875bb444e2e3f5911a557094FFCFc6638'));
  console.log(await ballot.getVote('0x2FA6894875bb444e2e3f5911a557094FFCFc6638'));

  // console.log(await ballot.getVote(deployer.address));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
