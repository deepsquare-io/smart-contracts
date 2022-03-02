const crowdsaleDpsHelper = require("../../helpers/crowdsale-dps");

async function setupCrowdsale(wallets, dps, usdtAddress, crowdsaleFunding) {
  // deploy CrowdsaleDps
  const crowdsaleDps = await crowdsaleDpsHelper.deployMarch22(
    dps.address,
    usdtAddress,
    true
  );

  // DPS grant access to Crowdsale address
  console.log("AAA address", crowdsaleDps.address);
  console.log("AAAA DPS", dps);
  // BUG LIGNE EN DESSOUS !!! LES 2 valeurs au dessus sont bonnes.
  console.log((await dps.grantAccess(crowdsaleDps.address)).wait());
  // Transfer fundings
  (await dps.transfer(crowdsaleDps.address, crowdsaleFunding)).wait();

  // add reference and transfer tokens to every wallet
  for (const address of wallets.keys()) {
    const v0 = await crowdsaleDps.setReference(
      address,
      wallets.get(address).reference
    );
    console.log(v0.nonce);
    await v0.wait();
    const v = await dps.transfer(address, wallets.get(address).value);
    console.log(v.nonce);
    await v.wait();
  }

  return crowdsaleDps;
}

module.exports = {
  setupCrowdsale,
};
