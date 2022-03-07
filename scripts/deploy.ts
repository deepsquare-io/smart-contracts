import 'dotenv/config';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { createERC20Agent } from '../test/utils/ERC20';

// const DPS = { address: '0x630C8D1dcdEA6b6b101d51293c59E759F479e7de' };
// const STC = { address: '0x12d280152B63eF5f630F92C6E6522123BC9d7AD7' };
// const eligibility = { address: '0x4D5B50C2f0f595f5929E9F63b62a38F24D5F6631' };
// const sale = { address: '0xF89D04978429C0FAd2CB031C281851E97a579a9E' };

async function main() {
  const BridgeTokenFactory = await ethers.getContractFactory('BridgeToken');
  const STC = await BridgeTokenFactory.deploy();
  console.log('STC deployed to', STC.address);

  const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
  const DPS = await DeepSquareFactory.deploy();
  console.log('DPS deployed to', DPS.address);

  const SpenderSecurityFactory = await ethers.getContractFactory('SpenderSecurity');
  const security = await SpenderSecurityFactory.deploy(DPS.address);
  console.log('SpenderSecurity deployed to', security.address);

  await DPS.setSecurity(security.address);
  console.log('SpenderSecurity set');

  const EligibilityFactory = await ethers.getContractFactory('Eligibility');
  const eligibility = await EligibilityFactory.deploy();
  console.log('Eligibility deployed to', eligibility.address);

  const SaleFactory = await ethers.getContractFactory('Sale');
  const sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40, 0);
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
