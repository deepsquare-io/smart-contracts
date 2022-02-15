const { ethers } = require("hardhat");

// Deploy DPS contract
async function deploy(showLogs = false) {
  const Dps = await ethers.getContractFactory("DPS");
  const dps = await Dps.deploy();
  return dps.deployed().then((contract) => {
    showLogs ?? console.log("DPS contract deployed to:", contract.address);
    return contract;
  });
}
module.exports = {
  deploy,
};
