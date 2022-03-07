import 'dotenv/config';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { createERC20Agent } from '../test/utils/ERC20';

// const DPS = { address: '0xde1f3d3f5eb6bc6a64080668b0961ccd6285b6f1' };
// const STC = { address: '0xbef8966426e866e8e1b1c1e7b74225b1c0d47060' };
// const eligibility = { address: '0x4D5B50C2f0f595f5929E9F63b62a38F24D5F6631' };
// const sale = { address: '0xF89D04978429C0FAd2CB031C281851E97a579a9E' };

async function main() {
  const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
  const DPS = await DeepSquareFactory.deploy();
  console.log('DPS deployed to', DPS.address);

  const TestERC20Factory = await ethers.getContractFactory('TestERC20');
  const STC = await TestERC20Factory.deploy(BigNumber.from(1e9).mul(1e6));
  console.log('STC deployed to', STC.address);

  const EligibilityFactory = await ethers.getContractFactory('Eligibility');
  const eligibility = await EligibilityFactory.deploy();
  console.log('Eligibility deployed to', eligibility.address);

  const SaleFactory = await ethers.getContractFactory('Sale');
  const sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40);
  console.log('Sale deployed to', sale.address);

  const agent = createERC20Agent(DeepSquareFactory.attach(DPS.address));
  await agent.transfer(sale.address, 7000000);
  console.log('DPS transferred to the Sale contract');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
