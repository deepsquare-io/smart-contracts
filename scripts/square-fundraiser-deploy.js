// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers;

/*
TODO : REMOVE UNUSED WHEN SURE
const { BigNumber } = ethers
const e18 = BigNumber.from(10).pow(18)
const e6 = BigNumber.from(10).pow(6)

const inToken = (value) => {
  return BigNumber.from(value).mul(e18)
}

*/

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];
  const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const square = await Square.deploy(owner.address, usdtAddress);
  await square.deployed();
  console.log("Square deployed to:", square.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
