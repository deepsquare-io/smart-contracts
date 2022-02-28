const { h1Separator, h2Separator } = require("../helpers/misc");
const { ethers } = require("hardhat");
async function checkDataIntegrity(dbWallets, ethWallets, ethWalletContract) {
  h1Separator();
  console.log("\n*** CHECK DATA INTEGRITY ***\n");
  // check sum of DPS is 210 millions
  const sumDps = ethWallets.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  console.log(
    "Check : sum of etherscan wallets is 210 million tokens : ",
    sumDps + ethWalletContract.value
  );
  console.log("DPS in DPS contract", ethWalletContract.value);

  h2Separator();
  const dbMap = new Map();
  const ethMap = new Map();

  dbWallets.forEach((v) => dbMap.set(v.address, v));
  ethWallets.forEach((v) => ethMap.set(v.address, v));

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

  console.log("There is a bijection between ETH and DB wallets addresses");

  // check for doubles
  dbWallets.forEach((v) => {
    if (dbMap.has(v.address)) {
      throw Error("There are double addresses in wallet : " + v.address);
    }
  });

  h2Separator();

  console.log("ETH wallets : ", ethWallets.length);
  console.log("DB wallets : ", dbWallets.length);

  console.log(
    "There are ",
    ethWallets.length - dbWallets.length,
    " addresses on etherscan that are not matched in database"
  );
  h2Separator();

  // compare two wallets
  const noKycWallets = [];
  const valueMismatchWallets = [];

  ethWallets.forEach((ethW, index) => {
    let match = false;

    for (let i = 0; i < dbWallets.length && !match; i++) {
      if (dbWallets[i].address === ethW.address) {
        match = true;
        if (dbWallets[i].balance_uDPS !== ethW.value * 10 ** 6) {
          valueMismatchWallets.push({
            address: ethW.address,
            ethValue: ethW.value,
            dbValue: dbWallets[i].value,
          });
        }
      }
    }

    if (!match) {
      noKycWallets.push(ethW);
    }
  });

  console.log(
    "There are ",
    noKycWallets.length,
    "addresses in database that don't correspond on etherscan"
  );
  noKycWallets.forEach((v) => {
    console.log(v.address, " with ", v.value);
  });

  console.log("wallets with value mismatch :", valueMismatchWallets);
  h1Separator();
}

module.exports = {
  checkDataIntegrity,
};
