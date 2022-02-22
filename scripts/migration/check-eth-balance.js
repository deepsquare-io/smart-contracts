const hre = require("hardhat");
require("dotenv").config();
const wallets = require("../../wallets.json");
const ethers = hre.ethers;

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT on ether mainnet
  const SquareFundRaiser = await ethers.getContractFactory(
    "SquareFundRaiser",
    [owner.address, USDT_ADDRESS] // TODO
  );
  const squareFundRaiser = await SquareFundRaiser.attach(
    "0x8dffcd9a2f392451e0ce7a1f0d73d65c5807ecd3"
  );

  const test = async function () {
    console.log("in test");
    const z = await squareFundRaiser.balanceOf(
      "0x9090bd563b2412743c66d34Fe235FF08f95E2bFe"
    );
    console.log(z);
  };
  await test();
  /*
  wallets.forEach(async function ({ reference, address }) {
    await squareFundRaiser.balanceOf(address);
  });
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
