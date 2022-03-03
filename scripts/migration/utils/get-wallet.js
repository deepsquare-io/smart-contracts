const dbWalletsFile = require("../../../wallets_db.json");
let ethWalletsFile = require("../../../wallets_etherscan.json");
const { precheckDataIntegrity } = require("./precheck-data-integrity");
const { walletsMigrationUpdatePre } = require("./wallets-migration-update");

const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { e6 } = require("../../helpers/misc");
const { dpsTokenDev } = require("./misc-migration");
function getWallet() {
  const TEMP_UPDATES_MIGRATION = true;

  const dbWallets = dbWalletsFile
    .map((v) => {
      return {
        address: ethers.utils.getAddress(v.address),
        value: dpsTokenDev(BigNumber.from(v.balance_uDPS).div(e6)),
        reference: v.reference,
      };
    })
    // filter 0 values
    .filter((v) => {
      return v.value != 0; // not !== because we deal with bigNumber
    });

  // map with checkSum and BigNumber
  ethWalletsFile = ethWalletsFile.map((v) => {
    return {
      address: ethers.utils.getAddress(v.address),
      value: dpsTokenDev(v.value),
    };
  });

  const ethWalletContract = ethWalletsFile[0];
  const ethWallets = ethWalletsFile.slice(1);

  if (TEMP_UPDATES_MIGRATION) {
    walletsMigrationUpdatePre(dbWallets, ethWallets, ethWalletContract);
  }

  const wallets = precheckDataIntegrity(
    dbWallets,
    ethWallets,
    ethWalletContract
  );
  return { wallets: wallets, owner: ethWalletContract };
}

module.exports = {
  getWallet,
};
