import { Presets, SingleBar } from 'cli-progress';
import { ethers, network } from 'hardhat';
import users from '../data/users.json';
import { DeepSquare__factory, LockingSecurity__factory } from '../typings';
import { Sale__factory } from '../typings/factories/contracts';

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'DeepSquare' | 'Sale';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x270D1399744874C72f95873eB9606172D155669D',
  },
  Sale: {
    hardhat: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '0x393C042f655Aa6D7Fd9F7cc8418bE0023dc1DcA4',
  },
};

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer] = await ethers.getSigners();

  console.log('Deployer: ', deployer.address);

  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);

  const SaleFactory = new Sale__factory(deployer);
  const Sale = SaleFactory.attach(addresses.Sale[networkName]);

  const LockingSecurityFactory = new LockingSecurity__factory(deployer);
  const LockingSecurity = await LockingSecurityFactory.deploy(DeepSquare.address);

  console.log('LockingSecurity: ', LockingSecurity.address);

  const gnosisAddress = await LockingSecurity.owner();

  console.log('Gnosis: ', gnosisAddress);

  if (networkName !== 'mainnet') {
    const progress = new SingleBar({}, Presets.shades_classic);
    progress.start(Object.keys(users).length, 0);

    for (let i = 0; i < users.length; i++) {
      progress.increment();
      await LockingSecurity.lock(users[i], {
        value: (await DeepSquare.balanceOf(users[i])).mul(25).div(100),
        release: Math.floor(Date.now() / 1000) + 3600000,
      });
    }

    progress.stop();
  }

  await LockingSecurity.grantRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), gnosisAddress);
  await LockingSecurity.grantRole(await LockingSecurity.SALE(), Sale.address);
  await LockingSecurity.renounceRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), deployer.address);
  await LockingSecurity.transferOwnership(gnosisAddress);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
