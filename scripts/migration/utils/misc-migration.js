const { BigNumber } = require("ethers");
const { e18, e12 } = require("../../helpers/misc");

/**
 * Different than dpsToken. It can accept float values
 * ONLY USE IN MIGRATION
 * @param {*} value
 * @returns
 */
const dpsTokenDev = (value) => {
  if (value % 1 === 0) {
    return BigNumber.from(value).mul(e18);
  } else {
    return BigNumber.from(value * Math.pow(10, 6)).mul(e12);
  }
};

module.exports = {
  dpsTokenDev,
};
