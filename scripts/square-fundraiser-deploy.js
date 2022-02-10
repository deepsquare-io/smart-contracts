const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  // TODO: change with correct USDT.e address
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
