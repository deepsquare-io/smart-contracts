require("dotenv").config();
const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const { ethers } = require("hardhat");
const usdtHelper = require("../helpers/usdt");
const dbWalletsFile = require("../../wallets_db.json");
let ethWalletsFile = require("../../wallets_etherscan.json");
const { checkDataIntegrity } = require("./check-data-integrity");
const { h1Separator, h1 } = require("../helpers/misc");
const { walletsMigrationUpdate } = require("./wallets-migration-update");
const dbWallets = dbWalletsFile
  // filter 0 values
  .filter((v) => {
    return parseFloat(v.balance_uDPS) !== 0;
  })
  .map((v) => {
    return {
      reference: v.reference,
      address: ethers.utils.getAddress(v.address),
      balance_uDPS: parseFloat(v.balance_uDPS),
    };
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

function databaseBalanceToTokens(value) {
  return dpsToken(value).div(1000000);
}
async function main() {
  // IMPORTANT CONSTANTS FOR DEPLOYMENT !
  const TEMP_UPDATES_MIGRATION = true;
  const CHECK_DATA_INTEGRITY = true;

  const RATE = 2; // TODO change
  const INITIAL_CROWDSALE_FUNDING_DPS = dpsToken(7000000);

  if (TEMP_UPDATES_MIGRATION) {
    walletsMigrationUpdate(dbWallets, ethWallets, ethWalletContract);
  }

  if (CHECK_DATA_INTEGRITY) {
    checkDataIntegrity(dbWallets, ethWallets, ethWalletContract);
  }
  const signers = await ethers.getSigners();
  const owner = signers[0];

  h1Separator();
  h1("Start contract deployments");
  // deploy DPS
  const dps = await deployDeepSquareToken(true);
  // deploy fakeUsdt
  const usdt = await usdtHelper.deploy(true);
  // deploy CrowdsaleDps
  const crowdsaleDps = await crowdsaleDpsHelper.deploy(
    RATE,
    dps.address,
    usdt.address,
    true
  );

  // DPS grant access to Crowdsale address
  await dps.grantAccess(crowdsaleDps.address);

  // check balance with 0 DPS;
  const balance0 = [];
  for (let i = 0; i < dbWallets.length; i++) {
    if (parseInt(dbWallets[i].balance_uDPS) === 0) {
      balance0.push(i);
    }
  }
  // console.log("Balance zero : ", balance0);

  // add reference and send tokens to every wallet
  for (let i = 0; i < dbWallets.length; i++) {
    try {
      await crowdsaleDps.setReference(
        dbWallets[i].address,
        dbWallets[i].reference
      );
    } catch (e) {
      console.log(
        "cannot set reference to wallet. Index : ",
        i,
        "address : ",
        dbWallets[i].address
      );
    }

    // transfer money
    // TODO: WATCH OUT !!! MATHIEU DPS TOKENS HOW MANY DECIMALS ?

    await dps.transfer(
      dbWallets[i].address,
      databaseBalanceToTokens(dbWallets[i].balance_uDPS)
    );
  }

  // check references are not the same

  // check balances
  let assertBalanceCorresponds = true;
  for (let i = 0; i < dbWallets.length; i++) {
    if (
      parseInt(databaseBalanceToTokens(dbWallets[i].balance_uDPS)) ===
      parseInt(await dps.balanceOf(dbWallets[i].address))
    ) {
      assertBalanceCorresponds = assertBalanceCorresponds && true;
    } else {
      assertBalanceCorresponds = false;
      console.log("-------");
      console.log("balance do not correspond on index ", i);
      console.log("json file : ", dbWallets[i].balance_uDPS);
      console.log("dps balance : ", await dps.balanceOf(dbWallets[i].address));
    }
  }
  console.log("All balances are the same : ", assertBalanceCorresponds);
  console.log("Current DPS balance :", await dps.balanceOf(owner.address));

  // DPS sends money to Crowdsale address
  const SEND_DPS_TO_CROWDSALE = false;
  if (SEND_DPS_TO_CROWDSALE) {
    await dps.transfer(crowdsaleDps.address, INITIAL_CROWDSALE_FUNDING_DPS);

    console.log(
      INITIAL_CROWDSALE_FUNDING_DPS,
      "DPS sent from DPS to Crowdsale\n"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
