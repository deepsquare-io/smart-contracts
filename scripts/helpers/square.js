const { ethers, upgrades } = require("hardhat");

// Deploy Square
async function deploy(usdtAddress, showLogs = false) {
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const square = await upgrades.deployProxy(Square, [usdtAddress]);
  return square.deployed().then((contract) => {
    showLogs ?? console.log("Square deployed to:", contract.address);
    return contract;
  });
}
module.exports = {
  deploy,
};
