require("dotenv").config();
require("dotenv").config();
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const { ethers } = require("hardhat");
const usdtHelper = require("../helpers/usdt");

const { h1Separator, h1, check } = require("../helpers/misc");
const {
  walletsMigrationUpdatePost,
} = require("./utils/wallets-migration-update");
const { setupCrowdsale } = require("./utils/deploy-crowdsale-dps");
const { getWallet } = require("./utils/get-wallet");

async function main() {

  const POSTCHECK_DATA_INTEGRITY = true;
  const SETUP_CROWDSALE = true;
  const DEPLOY_DPS = true;
  const PRODUCTION = false; // TODO false on production
  const INITIAL_CROWDSALE_FUNDING_DPS = dpsToken(7000000);

  let USDT_ADDRESS = "";
  // DPS sends money to Crowdsale address
  let dps; // dps contract

  const wallets = getWallet();
  walletsMigrationUpdatePost(wallets);

  const signers = await ethers.getSigners();
  const owner = signers[0];

  h1Separator();
  h1("START CONTRACT DEPLOYMENTS");
  // deploy DPS

  if (DEPLOY_DPS) {
    dps = await deployDeepSquareToken(true);
  }
  // deploy fakeUsdt
  if (!PRODUCTION) {
    const usdt = await usdtHelper.deploy(true);
    USDT_ADDRESS = usdt.address;
  }

  if (POSTCHECK_DATA_INTEGRITY) {
    h1Separator();
    h1("CHECK REMOTE DATA");
    let assertBalanceCorresponds = true;
    for (let i = 0; i < wallets.entries.length; i++) {
      if (
        wallets[i].value === parseInt(await dps.balanceOf(wallets[i].address))
      ) {
        assertBalanceCorresponds = assertBalanceCorresponds && true;
      } else {
        assertBalanceCorresponds = false;
        console.log("-------");
        console.log("balance do not correspond on index ", i);
        console.log("json file : ", wallets[i].value);
        console.log("dps balance : ", await dps.balanceOf(wallets[i].address));
      }
    }
    console.log("All balances are the same : ", assertBalanceCorresponds);
  }

  if (SETUP_CROWDSALE) {
    h1Separator();
    h1("LAUNCH CROWDSALE && SEND DPS TO WALLETS");
    const crowdsaleDps = await setupCrowdsale(wallets, dps, USDT_ADDRESS);
    await dps.transfer(crowdsaleDps.address, INITIAL_CROWDSALE_FUNDING_DPS);
    check(
      "Crowdsale DPS launched with " + INITIAL_CROWDSALE_FUNDING_DPS + " DPS"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
