const crowdsaleDpsHelper = require("../../helpers/crowdsale-dps");
const { h2Separator, check, display, e18 } = require("../../helpers/misc");
async function setupCrowdsale(wallets, dps, usdtAddress, crowdsaleFunding) {
  // deploy CrowdsaleDps
  const crowdsaleDps = await crowdsaleDpsHelper.deployMarch22(
    dps.address,
    usdtAddress,
    true
  );

  // DPS grant access to Crowdsale address
  (await dps.grantAccess(crowdsaleDps.address)).wait();
  // Transfer fundings
  (await dps.transfer(crowdsaleDps.address, crowdsaleFunding)).wait();

  // add reference and transfer tokens to every wallet
  for (const address of wallets.keys()) {
    h2Separator();
    display(address);
    const tx1 = await crowdsaleDps.setReference(
      address,
      wallets.get(address).reference
    );
    await tx1.wait();
    check(tx1.nonce + ": reference set. Gas : " + tx1.value);
    const tx2 = await dps.transfer(address, wallets.get(address).value);
    await tx2.wait();
    check("money transfered. Gas : " + tx2.value + ". Nonce : " + tx2.nonce);
  }

  return crowdsaleDps;
}

module.exports = {
  setupCrowdsale,
};
