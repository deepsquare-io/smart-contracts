const { h1Separator, h1, h2Separator } = require("../helpers/misc");

const { ethers } = require("hardhat");

function walletsMigrationUpdate(dbWallets, ethWallets, ethWalletContract) {
  h1Separator();
  h1("Pre-migration : address changes");
  // remove address with 375 000 DPS and add it to main pool
  const indexAddress98fa = ethWallets.findIndex(
    (v) =>
      v.address ===
      ethers.utils.getAddress("0x813b2b5541fa238514b0161712b40d2ca1bc98fa")
  );
  ethWalletContract.value += ethWallets[indexAddress98fa].value;
  ethWallets.splice(indexAddress98fa, 1);

  console.log(
    "Address 0x813b2b5541fa238514b0161712b40d2ca1bc98fa (375 000 DPS) removed back to the pool"
  );

  h2Separator();
  // D has made the KYC two times with two different addresses, remove 2nd address
  const indexRefD = ethWallets.findIndex((v) => v.reference === "in0eQ9c50hC1");
  ethWallets.splice(indexRefD, 1);
  console.log("D 2nd KYC ref deleted");

  h2Separator();
  // merge D's address with its main one
  const indexAddress1001 = ethWallets.findIndex(
    (v) =>
      v.address ===
      ethers.utils.getAddress("0x44590be69395b2bfa9c140a9ab70bc0389701001")
  );

  const indexAddressD = ethWallets.findIndex(
    (v) =>
      v.address ===
      ethers.utils.getAddress("0x07ad0de1fcb57a4d94afb759c3025ff8863cc077")
  );

  ethWallets[indexAddressD].value += ethWallets[indexAddress1001].value;

  ethWallets.splice(indexAddress1001, 1);
  console.log(
    "D 2nd address merged : address 0x44590be69395b2bfa9c140a9ab70bc0389701001 (35 000 DPS) merged into 0x07Ad0DE1fCB57A4D94AFB759C3025FF8863cC077"
  );
  dbWallets.push({
    address: ethers.utils.getAddress(
      "0xb1725bb44f8a8d254ebbaaa786e2be74a011b4b6"
    ),
    reference: "syi54pi9l44",
  });
  console.log(
    "0xb1725bb44f8a8d254ebbaaa786e2be74a011b4b6 : Reference added (TODO CHECK WITH MATHIEU!"
  );
  dbWallets.push({
    address: ethers.utils.getAddress(
      "0x8a6759d1e35c5a79bda0a941a5f4400fb36ddc5e"
    ),
    reference: "Rh8EcOx3lq9",
  });
  console.log(
    "0x8a6759d1e35c5a79bda0a941a5f4400fb36ddc5e : Reference added (TODO CHECK WITH MATHIEU!"
  );
  // merge this account (D, unaccessible) to his main account
}

module.exports = {
  walletsMigrationUpdate,
};
