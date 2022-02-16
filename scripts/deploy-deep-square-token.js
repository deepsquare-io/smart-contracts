const hre = require("hardhat");
require("dotenv").config();
const squareHelper = require("../scripts/helpers/square");

const ethers = hre.ethers;

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  await squareHelper.deploy(owner.address, process.env.USDTE_ADDRESS, true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
