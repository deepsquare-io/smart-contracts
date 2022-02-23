require("dotenv").config();
const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../helpers/deep-square-token");
const usdtHelper = require("../helpers/usdt");
const wallets = require("../../wallets.json");

async function main() {
  // IMPORTANT CONSTANTS FOR DEPLOYMENT !
  const RATE = 2;
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

  // DPS sends money to Crowdsale address
  await dps.transfer(crowdsaleDps.address, INITIAL_CROWDSALE_FUNDING_DPS);
  console.log(
    INITIAL_CROWDSALE_FUNDING_DPS,
    "DPS sent from DPS to Crowdsale\n"
  );

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
    await dps.transfer(wallets[i].address, wallets[i].balance_uDPS);
  }

  // check references are not the same

  // check balances
  let assertBalanceCorresponds = true;
  for (let i = 0; i < wallets.length; i++) {
    if (
      parseInt(wallets[i].balance_uDPS) ===
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
