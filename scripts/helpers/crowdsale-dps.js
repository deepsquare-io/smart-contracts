const { ethers } = require("hardhat");

/** Deploy CrowdsaleDps contract
 *
 * @param {*} rate
 * @param {*} deepSquareTokenAddress
 * @param {*} usdtAddress
 * @param {*} showLogs
 * @returns
 */
const factoryPromise = ethers.getContractFactory("CrowdsaleDps"); // only promise

async function deploy(
  rate,
  deepSquareTokenAddress,
  usdtAddress,
  showLogs = false
) {
  const contract = await (
    await factoryPromise
  ).deploy(rate, deepSquareTokenAddress, usdtAddress);
  return contract.deployed().then((contract) => {
    if (showLogs) {
      console.log("CrowdsaleDps contract deployed to:", contract.address);
    }
    return contract;
  });
}

/*
Create a contract by attaching address to  CrowdsaleDps contractFactory.
*/
async function attach(address) {
  return (await factoryPromise).attach(address);
}

const ADDRESS_NOT_EXIST = "CrowdsaleDps: address does not exist";
module.exports = {
  deploy,
  attach,
  ADDRESS_NOT_EXIST,
};
