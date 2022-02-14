const { randomBytes } = require("ethers/lib/utils");
const hre = require("hardhat");
const ethers = hre.ethers;
const { BigNumber } = ethers;
const usdtHelper = require("../scripts/helpers/usdt");
const e6 = BigNumber.from(10).pow(6);

const inToken = (value) => {
  return BigNumber.from(value).mul(e6);
};

async function main() {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  const addr1 = signers[1];

  // Deploy & fund owner account FakeUSDTe
  const fakeUSDTe = usdtHelper.attach(process.env.USDTE_ADDRESS);

  await fakeUSDTe.mint(
    owner.address,
    inToken(20000000),
    owner.address, // TODO : I don't understand what this parameter is for yet
    0,
    randomBytes(32)
  );

  console.log("FakeUSDTe mint to ", owner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
