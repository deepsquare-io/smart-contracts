// scripts/create-box.js

/**
 * THIS SCRIPT IS USED FOR SHOWING THAT VERSIONNING WORKS.
 * IN ORDER TO MAKE THE SCRIPT RUN, COPY PAST DpsFundRaiser.sol to
 * DpsFundRaiserV2.sol and add the following method :
 *     function newMethodAfterUpgrade() public pure returns (string memory) {
        return "New method from DpsFundRaiserV2 contract";
    }
 */
const { ethers, upgrades } = require("hardhat");
const squareHelper = require("../scripts/helpers/square");
function h2Separator() {
  console.log("---------------");
}

async function main() {
  const ethersSigners = await ethers.getSigners();
  const owner = ethersSigners[0];

  const usdtAddress = process.env.USDTE_ADDRESS;
  // Deploying
  h2Separator();
  console.log("*** V1 contract ***\n");
  const instance = await squareHelper.deploy(usdtAddress);

  console.log("Proxy deployed to :", instance.address);
  console.log("SquareV1 contract deployed");
  console.log(
    "V2 method does not exist yet (should be undefined) :",
    instance.newMethodAfterUpgrade,
    "\n"
  );
  // Upgrading

  h2Separator();
  console.log("*** V2 contract ***\n");
  const BoxV2 = await ethers.getContractFactory("DpsFundRaiserV2");
  const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
  console.log("Proxy upgraded");
  console.log("SquareV2 contract deployed");
  console.log("V2 method does exist :", upgraded.newMethodAfterUpgrade);
  console.log("V2 method returns :", await upgraded.newMethodAfterUpgrade());
  h2Separator();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
