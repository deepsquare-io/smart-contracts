import { ethers, network } from 'hardhat';
import { Advisors__factory } from '../typings/factories/contracts/Advisors__factory';
import { CommunityDev__factory } from '../typings/factories/contracts/CommunityDev__factory';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Team__factory } from '../typings/factories/contracts/Team__factory';
import { Treasury__factory } from '../typings/factories/contracts/Treasury__factory';

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'STC' | 'DeepSquare' | 'Eligibility';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  STC: {
    hardhat: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    mainnet: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    fuji: '0x40479524A1D4E8E160CB24B5D466e2a336327331',
  },
  DeepSquare: {
    hardhat: '0xf192caE2e7Cd4048Bea307368015E3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x7E8Ab41d9Fd280AAac0643d011E6241F6e540497',
  },
  Eligibility: {
    hardhat: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    mainnet: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    fuji: '0x64f8dE5BE4403E30e58394D3337d547F59be5035',
  },
};

async function main() {
  const networkName = network.name as NetworkName;

  const [deployer] = await ethers.getSigners();

  const DPS = new DeepSquare__factory(deployer).attach(addresses.DeepSquare[networkName]);
  const gnosisAddress = await DPS.owner();

  const Advisors = await new Advisors__factory(deployer).deploy(
    addresses.DeepSquare[networkName],
    addresses.STC[networkName],
    addresses.Eligibility[networkName],
    40,
  );
  await Advisors.deployed().then((c) => console.log('Advisors contract deployed at ', c.address));

  const CommunityDev = await new CommunityDev__factory(deployer).deploy(
    addresses.DeepSquare[networkName],
    addresses.STC[networkName],
    addresses.Eligibility[networkName],
    40,
  );
  await CommunityDev.deployed().then((c) => console.log('CommunityDev contract deployed at ', c.address));

  const Team = await new Team__factory(deployer).deploy(
    addresses.DeepSquare[networkName],
    addresses.STC[networkName],
    addresses.Eligibility[networkName],
    40,
  );
  await Team.deployed().then((c) => console.log('Team contract deployed at ', c.address));

  const Treasury = await new Treasury__factory(deployer).deploy(
    addresses.DeepSquare[networkName],
    addresses.STC[networkName],
    addresses.Eligibility[networkName],
    40,
  );
  await Treasury.deployed().then((c) => console.log('Treasury contract deployed at ', c.address));

  await Advisors.transferOwnership(gnosisAddress);
  await CommunityDev.transferOwnership(gnosisAddress);
  await Team.transferOwnership(gnosisAddress);
  await Treasury.transferOwnership(gnosisAddress);

  console.log('Ownership of contracts tranferred to ', gnosisAddress);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
