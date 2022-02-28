const { h1Separator, check } = require("../../helpers/misc");
function precheckDataIntegrity(dbWallets, ethWallets, ethWalletContract) {
  h1Separator();
  console.log("\n*** CHECK DATA INTEGRITY ***\n");
  // check sum of DPS is 210 millions
  const sumDps =
    ethWallets.reduce((sum, item) => {
      return sum + item.value;
    }, 0) + ethWalletContract.value;
  if (sumDps !== 210000000) {
    throw Error(
      "Check : sum of etherscan wallets is not 210 million tokens : " + sumDps
    );
  }
  check("Sum of wallets on etherscan is 210 million tokens");

  const dbMap = new Map();
  const ethMap = new Map();

  dbWallets.forEach((v) => {
    // check for doubles
    if (dbMap.has(v.address)) {
      throw Error("There are double addresses in db wallet : " + v.address);
    }
    dbMap.set(v.address, v);
  });

  ethWallets.forEach((v) => {
    // check for doubles
    if (ethMap.has(v.address)) {
      throw Error("There are double addresses in eth wallet : " + v.address);
    }
    ethMap.set(v.address, v);
  });

  // check for address bijection
  dbWallets.forEach((v) => {
    if (!ethMap.has(v.address)) {
      throw Error(
        "No bijection : " + v.address + " in DB but not in ETH wallets"
      );
    }
  });

  ethWallets.forEach((v) => {
    if (!dbMap.has(v.address)) {
      throw Error(
        "No bijection : " + v.address + " in ETH but not in DB wallets"
      );
    }
  });

  dbWallets.forEach((v) => {
    if (ethMap.get(v.address).value != v.value) {
      throw Error(
        "ETH / DB value mismatch on address " +
          v.address +
          " with value eth " +
          ethMap.get(v.address).value +
          " with value DB " +
          v.value
      );
    }
  });

  check("There is a bijection between ETH and DB wallets addresses");

  h1Separator();

  dbMap.forEach((v) => {
    ethMap.get(v.address).reference = v.reference;
  });

  return ethMap;
}

module.exports = {
  precheckDataIntegrity,
};
