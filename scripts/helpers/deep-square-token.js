const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;
const e18 = BigNumber.from(10).pow(18);

const factoryPromise = ethers.getContractFactory("DeepSquareToken");
// Deploy Dps contract
async function deployDeepSquareToken(showLogs = false) {
  const contractFactory = await factoryPromise;
  const contract = await contractFactory.deploy();
  return contract.deployed().then((contract) => {
    if (showLogs) {
      console.log("Dps contract deployed to:", contract.address);
    }
    return contract;
  });
}

async function attachDeepSquareToken(address) {
  return (await factoryPromise).attach(address);
}

const dpsToken = (value) => {
  return BigNumber.from(value).mul(e18);
};

module.exports = {
  deployDeepSquareToken,
  dpsToken,
  attachDeepSquareToken,
};
