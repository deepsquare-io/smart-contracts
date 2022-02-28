const crowdsaleDpsHelper = require("../helpers/crowdsale-dps");
const { dpsToken } = require("../helpers/deep-square-token");

async function setupCrowdsale(dbWallets, dps) {
  const USDT_ADDRESS = ""; // TODO change those constants to other address ?
  const DPS_ADDRESS = "";
  const RATE = "";
  // deploy CrowdsaleDps
  const crowdsaleDps = await crowdsaleDpsHelper.deploy(
    RATE,
    DPS_ADDRESS,
    USDT_ADDRESS,
    true
  );

  // DPS grant access to Crowdsale address
  await dps.grantAccess(crowdsaleDps.address);
  // add reference and send tokens to every wallet
  for (let i = 0; i < dbWallets.length; i++) {
    await crowdsaleDps.setReference(
      dbWallets[i].address,
      dbWallets[i].reference
    );

    // transfer money
    // TODO: WATCH OUT !!! MATHIEU DPS TOKENS HOW MANY DECIMALS ?

    await dps.transfer(dbWallets[i].address, dbWallets[i].value);
  }

  return crowdsaleDps;
}

module.exports = {
  setupCrowdsale,
};