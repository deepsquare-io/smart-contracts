const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;
const e18 = BigNumber.from(10).pow(18);

// Deploy Dps contract
async function deployDeepSquareToken(showLogs = false) {
  const contractFactory = await ethers.getContractFactory("DeepSquareToken");
  const contract = await contractFactory.deploy();
  return contract.deployed().then((contract) => {
    if (showLogs) {
      console.log("Dps contract deployed to:", contract.address);
    }
    return contract;
  });
}
const dpsToken = (value) => {
  return BigNumber.from(value).mul(e18);
};

module.exports = {
  deployDeepSquareToken,
  dpsToken,
};
