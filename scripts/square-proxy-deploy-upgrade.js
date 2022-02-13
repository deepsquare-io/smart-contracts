// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  const usdtAddress = process.env.USDTE_ADDRESS;
  // Deploying
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const instance = await upgrades.deployProxy(Square, [
    owner.address,
    usdtAddress,
  ]);
  await instance.deployed();

  console.log("Square deployed to :", instance.address);
  // Upgrading
  // BoxV2 = await ethers.getContractFactory("BoxV2");
  // const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
