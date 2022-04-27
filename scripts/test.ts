import { ethers } from 'hardhat';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { LockingSecurity__factory } from '../typings/factories/contracts/LockingSecurity__factory';

async function main() {
  const [deployer] = await ethers.getSigners();

  const LockingSecurityFactory = new LockingSecurity__factory(deployer);
  const LockingSecurity = await LockingSecurityFactory.attach('0xad115bA46A767FFf9d33B7601cb4639464d73ccB');

  const DeepSquare = await new DeepSquare__factory(deployer).attach('0xe6e53aCb26521412015952494E5dAF97d01A8919');

  console.log(await DeepSquare.connect(deployer).approve('0x2FA6894875bb444e2e3f5911a557094FFCFc6638', 1000));
  console.log('Allowance: OK');
  console.log(await DeepSquare.allowance(deployer.address, LockingSecurity.address));

  // console.log(await LockingSecurity.hasRole(await LockingSecurity.DEFAULT_ADMIN_ROLE(), deployer.address));
  // await DeepSquare.transfer('0x2FA6894875bb444e2e3f5911a557094FFCFc6638', 100000);
  // await DeepSquare.transferFrom(DeepSquare.address, deployer.address, 10);
  // await LockingSecurity.vest(deployer.address, { value: 10, release: Math.floor(Date.now() / 1000) + 1000 });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
