require("dotenv").config();
const { crowdsaleDpsHelper } = require("./helpers/crowdsale-dps");

async function main() {
  const USDT_ADDRESS = "";
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
}

return main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
