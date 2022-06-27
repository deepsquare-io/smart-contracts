import { ethers, network } from 'hardhat';
import { formatUnits, parseUnits } from '@ethersproject/units';
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

  console.log('deployer:', deployer.address);
  console.log('gnosis:', gnosisAddress);

  const avaxBalance = await deployer.getBalance();

  const votingDelegation = await new VotingDelegation__factory(deployer).deploy(DeepSquare.address);
  await votingDelegation.deployed();
  console.log('votingDelegation:', votingDelegation.address);
  const ballotImplementation = await new Ballot__factory(deployer).deploy(DeepSquare.address, votingDelegation.address);
  await ballotImplementation.deployed();
  console.log('ballotImplementation:', ballotImplementation.address);
  const ballotFactory = await new BallotFactory__factory(deployer).deploy(
    DeepSquare.address,
    ballotImplementation.address,
  );
  await ballotFactory.deployed();
  console.log('ballotFactory:', ballotFactory.address);

  if (networkName === 'fuji') {
    const ballotCreationTransaction = await ballotFactory.createBallot(
      'Is this deployment functional ?',
      'Can you see the description ? Are all parameters set up correctly ?',
      'Deployment',
      ['Yes', 'No'],
    );
    const cloneAddress: string = (await ballotCreationTransaction.wait()).events?.pop()?.args?.[0];
    console.log('Voting clone deployed at:', cloneAddress);
    const clone = new Ballot__factory(deployer).attach(cloneAddress);
    console.log('Attached to clone');

    await waitTx(DeepSquare.connect(dpsHolder).transfer(accounts[0].address, parseUnits('50000', 18)));
    console.log('Transferred DPS to voter 0');
    await waitTx(clone.connect(accounts[0]).vote('Yes'));
    console.log('Voting with:' + accounts[0].address);

    await waitTx(DeepSquare.connect(dpsHolder).transfer(accounts[1].address, parseUnits('25000', 18)));
    console.log('Transferred DPS to voter 1');
    await waitTx(clone.connect(accounts[1]).vote('No'));
    console.log('Voting with:' + accounts[1].address);

    await waitTx(clone.close());
  }

  await waitTx(votingDelegation.transferOwnership(gnosisAddress));
  console.log('Transferred voting delegation contract ownership to ' + gnosisAddress);
  await waitTx(ballotImplementation.renounceOwnership());
  console.log('Renounced to ballot implementation ownership.');
  await waitTx(ballotFactory.transferOwnership(gnosisAddress));
  console.log('Transferred ballot factory contract ownership to ' + gnosisAddress);

  console.log('Deployment cost : ' + formatUnits(avaxBalance.sub(await deployer.getBalance()), 18));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
