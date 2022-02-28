const dbWalletsFile = require("../../wallets_db.json");
let ethWalletsFile = require("../../wallets_etherscan.json");
const { precheckDataIntegrity } = require("./precheck-data-integrity");
const { walletsMigrationUpdatePre } = require("./wallets-migration-update");

const { ethers } = require("hardhat");
function getWallet() {
  const TEMP_UPDATES_MIGRATION = true;

  const dbWallets = dbWalletsFile
    .map((v) => {
      return {
        address: ethers.utils.getAddress(v.address),
        value: parseFloat(v.balance_uDPS) / 10 ** 6,
        reference: v.reference,
      };
    })
    // filter 0 values
    .filter((v) => {
      return v.value != 0; // not !== because we deal with bigNumber
    });

  // map with checkSum
  ethWalletsFile = ethWalletsFile.map((v) => {
    return {
      address: ethers.utils.getAddress(v.address),
      value: v.value,
    };
  });

  const ethWalletContract = ethWalletsFile[0];
  const ethWallets = ethWalletsFile.slice(1);

  if (TEMP_UPDATES_MIGRATION) {
    walletsMigrationUpdatePre(dbWallets, ethWallets, ethWalletContract);
  }

  const wallet = precheckDataIntegrity(
    dbWallets,
    ethWallets,
    ethWalletContract
  );
  return wallet;
}

module.exports = {
  getWallet,
};
