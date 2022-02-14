const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;

const e6 = BigNumber.from(10).pow(6);

const inToken = (value) => {
  return BigNumber.from(value).mul(e6);
};

module.exports = {
  inToken,
  e6,
};
