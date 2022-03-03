const { ethers } = require("hardhat");

const factoryPromise = ethers.getContractFactory("CrowdsaleDps"); // only promise
/** Deploy CrowdsaleDps contract
 *
 * @param {*} rate How many token units a buyer gets per stableCoin unit
 * @param {*} deepSquareTokenAddress
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

async function deployMarch22(
  deepSquareTokenAddress,
  usdtAddress,
  showLogs = false
) {
  return await deploy(
    2.5 * 10 ** 12,
    deepSquareTokenAddress,
    usdtAddress,
    showLogs
  );
}

const ADDRESS_NOT_EXIST = "CrowdsaleDps: address does not exist";
module.exports = {
  deploy,
  deployMarch22,
  attach,
  ADDRESS_NOT_EXIST,
};
