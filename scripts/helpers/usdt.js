const { ethers } = require("hardhat");
const { randomBytes } = require("ethers/lib/utils");

// Deploy USDT contract
async function deploy(showLogs = false) {
  const FakeUSDT = await ethers.getContractFactory("BridgeToken");
  const fakeUSDT = await FakeUSDT.deploy();
  return await fakeUSDT.deployed().then((contract) => {
    showLogs ?? console.log("fakeUSDT token deployed to : ", contract.address);
    return contract;
  });
}
async function mint(usdtContract, address, amount = 200000000) {
  return await usdtContract.mint(address, amount, address, 0, randomBytes(32));
}
module.exports = {
  deploy,
  mint,
};
