// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

function displaySeparator() {
  console.log("---------------");
}

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  const usdtAddress = process.env.USDTE_ADDRESS;
  // Deploying
  displaySeparator();
  console.log("*** V1 contract ***\n");
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const instance = await upgrades.deployProxy(Square, [
    owner.address,
    usdtAddress,
  ]);
  await instance.deployed();

  console.log("Proxy deployed to :", instance.address);
  console.log("SquareV1 contract deployed");
  console.log(
    "V2 method does not exist yet (should be undefined) :",
    instance.newMethodAfterUpgrade,
    "\n"
  );
  // Upgrading

  displaySeparator();
  console.log("*** V2 contract ***\n");
  const BoxV2 = await ethers.getContractFactory("SquareFundRaiserV2");
  const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
  console.log("Proxy upgraded");
  console.log("SquareV2 contract deployed");
  console.log("V2 method does exist :", upgraded.newMethodAfterUpgrade);
  console.log("V2 method returns :", await upgraded.newMethodAfterUpgrade());
  displaySeparator();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
