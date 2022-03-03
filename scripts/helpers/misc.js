const { BigNumber } = require("ethers");
function h1Separator() {
  console.log("\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n");
}
function h2Separator() {
  console.log("---------------");
}

function h1(title) {
  console.log("*** ", title, " ***\n");
}

function check(text) {
  console.log("-> ", text);
}

function display(text) {
  console.log(text);
}

function warning(text) {
  console.log("*** WARNING !!! *** " + text);
}

function bigNumberEqual(bn1, bn2) {
  return bn1.sub(bn2) == 0; // not === 0 because it is BigNumber
}

const e6 = BigNumber.from(10).pow(6);
const e18 = BigNumber.from(10).pow(18);
const e12 = BigNumber.from(10).pow(12);
module.exports = {
  h1Separator,
  h2Separator,
  h1,
  check,
  display,
  warning,
  bigNumberEqual,
  e6,
  e18,
  e12,
};
