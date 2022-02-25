const ethWalletsFile = require("../../wallets_etherscan.json");
const dbWalletsFile = require("../../wallets.json");
const { ethers } = require("hardhat");

async function main() {
  // initialize ethWallet (split contract and wallets)
  const ethWalletContract = ethWalletsFile[0];
  const ethWallets = ethWalletsFile.slice(1);

  // initialize dbWallets
  const dbWallets = dbWalletsFile
    // filter 0 values
    .filter((v) => {
      return parseFloat(v.balance_uDPS) !== 0;
    })
    .map((v) => {
      return {
        reference: v.reference,
        address: v.address,
        balance_uDPS: parseFloat(v.balance_uDPS),
      };
    })
    // sort by amount
    .sort((a, b) => {
      return b.balance_uDPS - a.balance_uDPS;
    });
  // check sum of DPS is 210 millions
  const sumDps = ethWallets.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  console.log(
    "Check : sum of etherscan wallets is 210 million tokens : ",
    sumDps + ethWalletContract.value
  );
  console.log("DPS in DPS contract", ethWalletContract.value);
  console.log("------");

  console.log("ETH wallets length : ", ethWallets.length);
  console.log("DB wallets length : ", dbWallets.length);

  console.log(
    "Warning : there are ",
    ethWallets.length - dbWallets.length,
    " addresses on etherscan without a KYC"
  );
  console.log("------");

  // compare two wallets
  const noKycWallets = [];
  const valueMismatchWallets = [];

  ethWallets.forEach((ethW, index) => {
    let match = false;

    for (let i = 0; i < dbWallets.length && !match; i++) {
      if (dbWallets[i].address === ethers.utils.getAddress(ethW.address)) {
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

  // console.log(ethWallets[0].value * 10 ** 6 === dbWallets[0].balance_uDPS);
  console.log(noKycWallets.length);
  noKycWallets.forEach((v) => {
    console.log(v.address, " with ", v.value);
  });
  // console.log("wallets with no KYC :", noKycWallets);
  // console.log("wallets with value mismatch :", valueMismatchWallets);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
