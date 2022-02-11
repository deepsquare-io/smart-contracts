const hre = require("hardhat");
require("dotenv").config();

const ethers = hre.ethers;

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  const usdtAddress = process.env.USDTE_ADDRESS;
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
