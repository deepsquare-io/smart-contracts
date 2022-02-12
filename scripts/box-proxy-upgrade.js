// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x20e2364cCDB5030951376ADfe93CCa052f6c402b";
  const BoxV2 = await ethers.getContractFactory("Box");
  const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  console.log("Your upgraded proxy is done !", boxV2.address);
  console.log("2nd version : ", boxV2.retrieve());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
