require("dotenv").config();
const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const { ethers } = require("hardhat");
const usdtHelper = require("../helpers/usdt");
const wallets = require("../../wallets.json");

function databaseBalanceToTokens(value) {
  return dpsToken(value).div(1000000);
}
async function main() {
  // IMPORTANT CONSTANTS FOR DEPLOYMENT !
  const RATE = 2; // TODO change
  const INITIAL_CROWDSALE_FUNDING_DPS = dpsToken(7000000);
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

  const signers = await ethers.getSigners();
  const owner = signers[0];

  // DPS grant access to Crowdsale address
  await dps.grantAccess(crowdsaleDps.address);

  // check balance with 0 DPS;
  const balance0 = [];
  for (let i = 0; i < wallets.length; i++) {
    if (parseInt(wallets[i].balance_uDPS) === 0) {
      balance0.push(i);
    }
  }
  // console.log("Balance zero : ", balance0);

  // add reference and send tokens to every wallet
  for (let i = 0; i < wallets.length; i++) {
    try {
      await crowdsaleDps.setReferenceTo(
        wallets[i].address,
        wallets[i].reference
      );
    } catch (e) {
      console.log(
        "cannot set reference to wallet. Index : ",
        i,
        "address : ",
        wallets[i].address
      );
    }

    // transfer money
    // TODO: WATCH OUT !!! MATHIEU DPS TOKENS HOW MANY DECIMALS ?

    await dps.transfer(
      wallets[i].address,
      databaseBalanceToTokens(wallets[i].balance_uDPS)
    );
  }

  // check references are not the same

  // check balances
  let assertBalanceCorresponds = true;
  for (let i = 0; i < wallets.length; i++) {
    if (
      parseInt(databaseBalanceToTokens(wallets[i].balance_uDPS)) ===
      parseInt(await dps.balanceOf(wallets[i].address))
    ) {
      assertBalanceCorresponds = assertBalanceCorresponds && true;
    } else {
      assertBalanceCorresponds = false;
      console.log("-------");
      console.log("balance do not correspond on index ", i);
      console.log("json file : ", wallets[i].balance_uDPS);
      console.log("dps balance : ", await dps.balanceOf(wallets[i].address));
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
