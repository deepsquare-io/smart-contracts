import { ethers, network } from 'hardhat';
import { parseUnits } from '@ethersproject/units';
import { DeepSquare__factory } from '../typings';
import { Ballot__factory } from '../typings/factories/contracts/Ballot__factory';
import { VotingDelegation__factory } from '../typings/factories/contracts/VotingDelegation__factory';
import { BallotFactory__factory } from '../typings/factories/contracts/factories/BallotFactory__factory';

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
  const [deployer, ...accounts] = await ethers.getSigners();

  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);

  const gnosisAddress = await DeepSquare.owner();

  console.log('deployer:', deployer.address);
  console.log('gnosis:', gnosisAddress);

  const votingDelegation = await new VotingDelegation__factory(deployer).deploy(DeepSquare.address);
  const ballotImplementation = await new Ballot__factory(deployer).deploy(DeepSquare.address, votingDelegation.address);
  const ballotFactory = await new BallotFactory__factory(deployer).deploy(ballotImplementation.address);

  if (networkName === 'fuji') {
    const ballotCreationTransaction = await ballotFactory.createBallot(
      'Is this deployment functional ?',
      'Deployment',
      ['Yes', 'No'],
    );
    const cloneAddress: string = (await ballotCreationTransaction.wait()).events?.pop()?.args?.[0];
    console.log('Voting clone deploy at: ', cloneAddress);
    const clone = new Ballot__factory(deployer).attach(cloneAddress);
    await DeepSquare.connect(gnosisAddress).transfer(deployer.address, parseUnits('50000', 18));
    await clone.vote(0);
    await DeepSquare.connect(gnosisAddress).transfer(accounts[0].address, parseUnits('25000', 18));
    await clone.connect(accounts[0].address).vote(0);
    await DeepSquare.connect(gnosisAddress).transfer(accounts[1].address, parseUnits('25000', 18));
    await clone.connect(accounts[1].address).vote(1);

    await clone.close();
    console.log('Vote results: ');
    const choices = await clone.getChoices();
    for (const [index, result] of (await clone.getResults()).entries()) {
      console.log(`${choices[index]}: ${result.toString()}`);
    }
  }

  await votingDelegation.transferOwnership(gnosisAddress);
  await ballotImplementation.renounceOwnership();
  await ballotFactory.transferOwnership(gnosisAddress);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
