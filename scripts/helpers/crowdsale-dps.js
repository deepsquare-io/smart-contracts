const { ethers } = require("hardhat");

/** Deploy CrowdsaleDps contract
 *
 * @param {*} usdtAddress
 * @param {*} showLogs
 * @returns
 */
async function deploy(
  rate,
  deepSquareTokenAddress,
  usdtAddress,
  showLogs = false
) {
  const contractFactory = await ethers.getContractFactory("CrowdsaleDps");

  const contract = await contractFactory.deploy(
    rate,
    deepSquareTokenAddress,
    usdtAddress,
  );
  return contract.deployed().then((contract) => {
    showLogs ??
      console.log("CrowdsaleDps contract deployed to:", contract.address);
    return contract;
  });
}
module.exports = {
  deploy,
};
