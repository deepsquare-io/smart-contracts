const { h1Separator, h1, display } = require("../../helpers/misc");

const { ethers } = require("hardhat");
const { dpsTokenDev } = require("./misc-migration");

function walletsMigrationUpdatePre(dbWallets, ethWallets, ethWalletContract) {
  h1Separator();
  h1("PRE-MIGRATION : ADDRESS CHANGES");
  // remove address with 375 000 DPS and add it to main pool
  const indexAddress98fa = ethWallets.findIndex(
    (v) =>
      v.address ===
      ethers.utils.getAddress("0x813b2b5541fa238514b0161712b40d2ca1bc98fa")
  );
  ethWalletContract.value = ethWalletContract.value.add(
    ethWallets[indexAddress98fa].value
  );
  ethWallets.splice(indexAddress98fa, 1);

  display(
    "Address 0x813b2b5541fa238514b0161712b40d2ca1bc98fa (375 000 DPS) removed back to the pool"
  );
  // ---------------
  // Add D 2nd address
  dbWallets.push({
    address: ethers.utils.getAddress(
      "0x44590be69395b2bfa9c140a9ab70bc0389701001"
    ),
    reference: "RANDOM",
    value: dpsTokenDev(35000),
  });
  display(
    "Add D 2nd address (35000) with random reference to dbWallets. Will be deleted later anyway"
  );
  // ---------------
  // Add Reference (see with Mathieu)
  dbWallets.push({
    address: ethers.utils.getAddress(
      "0xb1725bb44f8a8d254ebbaaa786e2be74a011b4b6"
    ),
    reference: "syi54pi9l44",
    value: dpsTokenDev(16092.5),
  });

  display(
    "0xb1725bb44f8a8d254ebbaaa786e2be74a011b4b6 : Reference added (TODO CHECK WITH MATHIEU!)"
  );
  // ---------------
  // Add Reference (see with Mathieu)
  dbWallets.push({
    address: ethers.utils.getAddress(
      "0x8a6759d1e35c5a79bda0a941a5f4400fb36ddc5e"
    ),
    reference: "Rh8EcOx3lq9",
    value: dpsTokenDev(5000),
  });

  display(
    "0x8a6759d1e35c5a79bda0a941a5f4400fb36ddc5e : Reference added (TODO CHECK WITH MATHIEU!)"
  );

  // D has made the KYC two times with two different addresses, remove 2nd address
  const indexRefD = dbWallets.findIndex((v) => v.reference === "in0eQ9c50hC1");
  dbWallets.splice(indexRefD, 1);
  display("D 2nd KYC ref deleted");
}

function walletsMigrationUpdatePost(wallets) {
  h1("PRE-MIGRATION : ADDRESS MERGE");
  // merge D's address with its main one
  const address1001 = ethers.utils.getAddress(
    "0x44590be69395b2bfa9c140a9ab70bc0389701001"
  );

  const addressD = ethers.utils.getAddress(
    "0x07ad0de1fcb57a4d94afb759c3025ff8863cc077"
  );

  wallets.get(addressD).value = wallets
    .get(addressD)
    .value.add(wallets.get(address1001).value);
  wallets.delete(address1001);
  display(
    "D 2nd address merged : address 0x44590be69395b2bfa9c140a9ab70bc0389701001 (35 000 DPS) merged into 0x07Ad0DE1fCB57A4D94AFB759C3025FF8863cC077"
  );
  // ---------------
}

module.exports = {
  walletsMigrationUpdatePre,
  walletsMigrationUpdatePost,
};
