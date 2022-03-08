import 'dotenv/config';
import { ethers } from 'hardhat';
import { createERC20Agent } from '../test/utils/ERC20';

async function main() {
  const BridgeTokenFactory = await ethers.getContractFactory('BridgeToken');
  const STC = await BridgeTokenFactory.deploy();
  console.log('STC deployed to', STC.address);

  const SpenderSecurityFactory = await ethers.getContractFactory('SpenderSecurity');
  const security = await SpenderSecurityFactory.deploy();
  console.log('SpenderSecurity deployed to', security.address);

  const DeepSquareFactory = await ethers.getContractFactory('DeepSquare');
  const DPS = await DeepSquareFactory.deploy(security.address);
  console.log('DPS deployed to', DPS.address);

  const EligibilityFactory = await ethers.getContractFactory('Eligibility');
  const eligibility = await EligibilityFactory.deploy();
  console.log('Eligibility deployed to', eligibility.address);

  const SaleFactory = await ethers.getContractFactory('Sale');
  const sale = await SaleFactory.deploy(DPS.address, STC.address, eligibility.address, 40, 0);
  console.log('Sale deployed to', sale.address);

  const agent = await createERC20Agent(DeepSquareFactory.attach(DPS.address));
  await agent.transfer(sale.address, 7000000);
  console.log('DPS transferred to the Sale contract');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
