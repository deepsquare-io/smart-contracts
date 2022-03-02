require("dotenv").config();
require("dotenv").config();
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const { ethers } = require("hardhat");
const usdtHelper = require("../helpers/usdt");

const {
  h1Separator,
  h1,
  check,
  h2Separator,
  display,
  bigNumberEqual,
  warning,
  e6,
} = require("../helpers/misc");
const {
  walletsMigrationUpdatePost,
} = require("./utils/wallets-migration-update");
const { setupCrowdsale } = require("./utils/deploy-crowdsale-dps");
const { getWallet } = require("./utils/get-wallet");
const { BigNumber } = require("ethers");

async function main() {
  const POSTCHECK_DATA_INTEGRITY = true;
  const SETUP_CROWDSALE = true;
  const DEPLOY_DPS = true;
  const PRODUCTION = false; // TODO false on production
  const INITIAL_CROWDSALE_FUNDING_DPS = dpsToken(7000000);

  let USDT_ADDRESS = "";
  // DPS sends money to Crowdsale address
  let dps; // dps contract

  const data = getWallet();
  const wallets = data.wallets;
  const ownerAdressEtherscan = data.owner;
  walletsMigrationUpdatePost(wallets);

  const signers = await ethers.getSigners();
  const owner = signers[0];

  h1Separator();
  h1("START CONTRACT DEPLOYMENTS");
  // deploy DPS

  if (DEPLOY_DPS) {
    dps = await deployDeepSquareToken(true);
  }
  // deploy fakeUsdt and mint
  if (!PRODUCTION) {
    const usdt = await usdtHelper.deploy(true);
    // mint
    const usdtMintAmount = BigNumber.from(10).mul(e6);
    await usdtHelper.mint(
      usdt,
      owner.address,
      usdtHelper.token(usdtMintAmount)
    );
    check(usdtMintAmount + " USDT minted to owner account");
    USDT_ADDRESS = usdt.address;
  }

  if (SETUP_CROWDSALE) {
    h1Separator();
    h1("LAUNCH CROWDSALE && SEND DPS TO WALLETS");
    await setupCrowdsale(
      wallets,
      dps,
      USDT_ADDRESS,
      INITIAL_CROWDSALE_FUNDING_DPS
    );
    check(
      "Crowdsale DPS launched with " + INITIAL_CROWDSALE_FUNDING_DPS + " DPS"
    );
  }

  if (POSTCHECK_DATA_INTEGRITY) {
    h1Separator();
    h1("CHECK ADDRESSES BALANCE ON NETWORK");
    let assertBalanceCorresponds = true;

    for (const address of wallets.keys()) {
      const balance = await dps.balanceOf(address);
      if (bigNumberEqual(wallets.get(address).value, balance)) {
        assertBalanceCorresponds = assertBalanceCorresponds && true;
      } else {
        h2Separator();
        assertBalanceCorresponds = false;
        display("balance do not correspond on address ", address);
        display("wallets.json : ", wallets.get(address).value);
        display("dps balance : ", await dps.balanceOf(address));
      }
    }

    if (assertBalanceCorresponds) {
      check("All wallets addresses correspond");
    } else {
      warning("Wallets do not correspond");
    }

    // check that DPS pool is the same
    const balanceOwner = await dps.balanceOf(owner.address);
    const expectedOwnerAmount = balanceOwner.add(INITIAL_CROWDSALE_FUNDING_DPS);

    if (bigNumberEqual(ownerAdressEtherscan.value, expectedOwnerAmount)) {
      check("Owner wallet address correspond");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
