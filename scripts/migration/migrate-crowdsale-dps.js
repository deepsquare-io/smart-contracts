require("dotenv").config();
const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");
const { deployDeepSquareToken } = require("../helpers/deep-square-token");
const usdtHelper = require("../helpers/usdt");
const wallets = require("../../wallets.json");
const { getJsonWalletAddress } = require("ethers/lib/utils");

async function main() {
  // deploy DPS
  const dps = await deployDeepSquareToken(true);
  // deploy fakeUsdt
  const usdt = await usdtHelper.deploy(true);
  // deploy CrowdsaleDps
  const RATE = 2;
  const crowdsaleDps = await crowdsaleDpsHelper.deploy(
    RATE,
    dps.address,
    usdt.address,
    true
  );

  // set balances
  for (let i = 0; i < wallets.length; i++) {
    await dps.transfer(wallets[i].address, wallets[i].balance_uDPS);
  }

  // check references are not the same

  // check balances
  let assertBalanceCorresponds = true;
  for (let i = 0; i < wallets.length; i++) {
    if (wallets[i].balance_uDPS == (await dps.balanceOf(wallets[i].address))) {
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
