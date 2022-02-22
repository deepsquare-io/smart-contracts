const hre = require("hardhat");
require("dotenv").config();
const wallets = require("../../wallets.json");
const ethers = hre.ethers;
const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  // attach crowdsaleDps
  const CROWDSALE_DPS_ADDRESS = process.env.CROWDSALE_DPS_ADDRESS;
  const crowdsaleDps = await crowdsaleDpsHelper.attach(CROWDSALE_DPS_ADDRESS);

  // migrate data
  console.log(crowdsaleDps);
  const z = await crowdsaleDps.balanceOf(
    "0x9090bd563b2412743c66d34Fe235FF08f95E2bFe"
  );
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
