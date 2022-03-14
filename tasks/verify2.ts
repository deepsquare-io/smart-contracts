import { subtask, task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import DeepSquare from '../lib/types/DeepSquare';
import { Sale } from '../lib/types/Sale';

interface Verify2Args {
  saleAddress: string;
}

subtask('verify:verify', '', async (args, hre, runSuper) => {
  try {
    await runSuper(args);
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      (err as { message: string }).message.match(/already verified/i)
    ) {
      console.log('Contract is already verified, skipping');
      return;
    }

    throw err;
  }
});

task<Verify2Args>(
  'verify2',
  'Verify all the DeepSquare smart contracts at once',
  async ({ saleAddress }, { ethers, run }: HardhatRuntimeEnvironment) => {
    const SaleFactory = await ethers.getContractFactory('Sale');
    const Sale = SaleFactory.attach(saleAddress) as Sale;
    const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
    const DPS = DeepSquareFactory.attach(await Sale.DPS()) as DeepSquare;

    await run('verify:verify', { address: await Sale.eligibility() }); // Eligibility
    await run('verify:verify', { address: await DPS.security() }); // SpenderSecurity
    await run('verify:verify', { address: DPS.address, constructorArguments: [await DPS.security()] }); // DeepSquare

    // Sale
    await run('verify:verify', {
      address: saleAddress,
      constructorArguments: [
        await Sale.DPS(),
        await Sale.STC(),
        await Sale.eligibility(),
        await Sale.rate(),
        await Sale.minimumPurchaseSTC(),
        await Sale.sold(),
      ],
    });
  },
).addPositionalParam('saleAddress', 'The Sale contract address');
