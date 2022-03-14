import hre, { ethers } from 'hardhat';
import DeepSquare from '../lib/types/DeepSquare';
import { Sale } from '../lib/types/Sale';

const SALE_ADDRESS = '0x70002ecdf48c53EDD66EA18A7B1d4810b77056ef'; // change it

async function verify(address: string, args?: unknown[]) {
  try {
    await hre.run('verify:verify', {
      address,
      constructorArguments: args,
    });
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      (err as { message: string }).message.includes('Already Verified')
    ) {
      console.log('=> Already verified, skipping');
      return;
    }

    throw err;
  }
}

async function main() {
  const SaleFactory = await ethers.getContractFactory('Sale');
  const sale = SaleFactory.attach(SALE_ADDRESS) as Sale;
  const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
  const DPS = DeepSquareFactory.attach(await sale.DPS()) as DeepSquare;

  await verify(await sale.STC()); // BridgeToken
  await verify(await sale.eligibility()); // Eligibility
  await verify(await DPS.security()); // SpenderSecurity
  await verify(DPS.address, [await DPS.security()]); // DeepSquare
  await verify(await DPS.security()); // SpenderSecurity

  // Sale
  await verify(SALE_ADDRESS, [
    await sale.DPS(),
    await sale.STC(),
    await sale.eligibility(),
    40,
    250e6,
    await sale.sold(),
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
