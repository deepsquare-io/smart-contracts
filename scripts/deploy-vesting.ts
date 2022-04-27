import { Presets, SingleBar } from 'cli-progress';
import { ethers, network } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import users from '../data/users.json';
import { ZERO_ADDRESS } from '../lib/constants';
import { DeepSquare } from '../typings/contracts/DeepSquare';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { LockingSecurity__factory } from '../typings/factories/contracts/LockingSecurity__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';

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

  console.log('Network: ', networkName);
  console.log('Deployer: ', deployer.address);

  let DeepSquare: DeepSquare;
  if (networkName === 'fuji') {
    const DeepSquareFactory = new DeepSquare__factory(deployer);
    DeepSquare = await DeepSquareFactory.deploy(ZERO_ADDRESS);
  } else {
    const DeepSquareFactory = new DeepSquare__factory(deployer);
    DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);
  }

  console.log('DPS: ', DeepSquare.address);

  const SaleFactory = new Sale__factory(deployer);
  const Sale = SaleFactory.attach(addresses.Sale[networkName]);

  const LockingSecurityFactory = new LockingSecurity__factory(deployer);
  const LockingSecurity = await LockingSecurityFactory.deploy(DeepSquare.address);

  console.log('LockingSecurity: ', LockingSecurity.address);

  const gnosisAddress = await LockingSecurity.owner();

  console.log('Gnosis: ', gnosisAddress);

  if (networkName !== 'mainnet') {
    await DeepSquare.setSecurity(LockingSecurity.address);
    console.log('Security: OK');

    await DeepSquare.approve(LockingSecurity.address, await DeepSquare.balanceOf(deployer.address));
    console.log('\nApprove: OK');

    console.log(await DeepSquare.allowance(deployer.address, LockingSecurity.address));
    console.log('balance:', await DeepSquare.balanceOf(deployer.address));

    const progress = new SingleBar({}, Presets.shades_classic);
    progress.start(Object.keys(users).length, 0);

    for (const [user, balance] of (users as Array<[string, string]>).values()) {
      progress.increment();
      if (networkName === 'fuji') {
        await LockingSecurity.vest(user, {
          value: BigNumber.from(balance).mul(25).div(100),
          release: Math.floor(Date.now() / 1000) + 4 * 3600,
        });
        await LockingSecurity.vest(user, {
          value: BigNumber.from(balance).mul(75).div(100),
          release: Math.floor(Date.now() / 1000) + 20 * 3600,
        });
      } else {
        await LockingSecurity.lock(user, {
          value: BigNumber.from(balance).mul(25).div(100),
          release: Math.floor(Date.now() / 1000) + 4 * 3600,
        });
      }
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
