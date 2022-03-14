import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { ZERO_ADDRESS } from '../lib/constants';

const SALE_ADDRESS = '0x007f1e23a2D0090e7a1c83F810b794d775142168'; // change it

async function main() {
  const BridgeTokenFactory = await ethers.getContractFactory('BridgeToken');
  const STC = BridgeTokenFactory.attach(SALE_ADDRESS);

  await STC.mint(
    '0x71f222F36bE1C89D55Ec00aB09B79b9707Cda829',
    BigNumber.from(1e9).mul(1e6),
    ZERO_ADDRESS,
    0,
    ethers.utils.id('origin'),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
