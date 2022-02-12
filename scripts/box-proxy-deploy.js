// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box = await ethers.getContractFactory("Box");

  const box = await upgrades.deployProxy(Box, [56]);
  await box.deployed();
  console.log("Box deployed to:", box.address);
  console.log("First version : ", await box.retrieve());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
