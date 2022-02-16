const { ethers, upgrades } = require("hardhat");

/** Deploy DpsFundRaiser contract
 *
 * @param {*} usdtAddress
 * @param {*} showLogs
 * @returns
 */
async function deploy(usdtAddress, showLogs = false) {
  const contractFactory = await ethers.getContractFactory("DpsFundRaiser");
  const contract = await upgrades.deployProxy(contractFactory, [usdtAddress]);
  return contract.deployed().then((contract) => {
    showLogs ?? console.log("DpsFundRaiser contract deployed to:", contract.address);
    return contract;
  });
}
module.exports = {
  deploy,
};