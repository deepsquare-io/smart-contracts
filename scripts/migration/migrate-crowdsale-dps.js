require("dotenv").config();
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const { ethers } = require("hardhat");
const usdtHelper = require("../helpers/usdt");

const { h1Separator, h1, h2Separator } = require("../helpers/misc");
const { walletsMigrationUpdatePost } = require("./wallets-migration-update");
const { setupCrowdsale } = require("./deploy-crowdsale-dps");
const { getWallet } = require("./get-wallet");

async function main() {
  // IMPORTANT CONSTANTS FOR DEPLOYMENT !

  const POSTCHECK_DATA_INTEGRITY = true;
  const SETUP_CROWDSALE = true;
  const DEPLOY_DPS = true;
  const DEPLOY_FAKE_USDT = true; // TODO false on production
  const INITIAL_CROWDSALE_FUNDING_DPS = dpsToken(7000000);

  let USDT_ADDRESS = "";
  // DPS sends money to Crowdsale address
  const SEND_DPS_TO_CROWDSALE = false;
  let dps; // dps contract TODO rename

  const wallets = getWallet();
  walletsMigrationUpdatePost(wallets);

  const signers = await ethers.getSigners();
  const owner = signers[0];

  h1Separator();
  h1("Start contract deployments");
  // deploy DPS

  if (DEPLOY_DPS) {
    dps = await deployDeepSquareToken(true);
  }
  // deploy fakeUsdt
  if (DEPLOY_FAKE_USDT) {
    const usdt = await usdtHelper.deploy(true);
    USDT_ADDRESS = usdt.address;
  }

  h2Separator();

  let crowdsaleDps;
  if (SETUP_CROWDSALE) {
    crowdsaleDps = setupCrowdsale(wallets, dps);
  }

  if (POSTCHECK_DATA_INTEGRITY) {
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
    console.log("Current DPS balance :", await dps.balanceOf(owner.address));
  }

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
