const { ethers } = require("hardhat");
const { randomBytes } = require("ethers/lib/utils");

const FakeUSDT = ethers.getContractFactory("BridgeToken");

// Deploy USDT contract
async function deploy(showLogs = false) {
  const fakeUSDT = await (await FakeUSDT).deploy();

  return fakeUSDT.deployed().then((contract) => {
    showLogs ?? console.log("fakeUSDT token deployed to : ", contract.address);
    return contract;
  });
}

/*
Create a contract by attaching address to  USDT BridgeToken contractFactory.
@example : USDT.e
*/
async function attach(address) {
  return (await FakeUSDT).attach(address);
}

/** Mint contract */
async function mint(usdtContract, address, amount) {
  return usdtContract.mint(address, amount, address, 0, randomBytes(32));
}
module.exports = {
  deploy,
  attach,
  mint,
};
