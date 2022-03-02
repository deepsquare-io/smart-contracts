const crowdsaleDpsHelper = require("../../helpers/crowdsale-dps");

async function setupCrowdsale(wallets, dps, usdtAddress, crowdsaleFunding) {
  // deploy CrowdsaleDps
  const crowdsaleDps = await crowdsaleDpsHelper.deployMarch22(
    dps.address,
    usdtAddress,
    true
  );

  // DPS grant access to Crowdsale address
  await dps.grantAccess(crowdsaleDps.address);
  // Transfer fundings
  await dps.transfer(crowdsaleDps.address, crowdsaleFunding);

  // add reference and transfer tokens to every wallet
  for (const address of wallets.keys()) {
    await crowdsaleDps.setReference(address, wallets.get(address).reference);
    await dps.transfer(address, wallets.get(address).value);
  }

  return crowdsaleDps;
}

module.exports = {
  setupCrowdsale,
};
