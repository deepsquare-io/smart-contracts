const { ethers } = require("hardhat");

// Deploy Dps contract
async function deploy(showLogs = false) {
  const contractFactory = await ethers.getContractFactory("DeepSquareToken");
  const contract = await contractFactory.deploy();
  return contract.deployed().then((contract) => {
    showLogs ?? console.log("Dps contract deployed to:", contract.address);
    return contract;
  });
}
module.exports = {
  deploy,
};
