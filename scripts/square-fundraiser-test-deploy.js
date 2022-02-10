const { randomBytes } = require("ethers/lib/utils");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = ethers;

const e6 = BigNumber.from(10).pow(6);
// const e18 = BigNumber.from(10).pow(18)

const inToken = (value) => {
  return BigNumber.from(value).mul(e6);
};

async function main() {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  const addr1 = signers[1];
  const addr2 = signers[2];

  // Deploy & fund FakeUSDTe
  const FakeUSDTe = await ethers.getContractFactory("BridgeToken");
  const fakeUSDTe = await FakeUSDTe.deploy();
  await fakeUSDTe.deployed();

  // Fund owner account
  await fakeUSDTe.mint(
    owner.address,
    inToken(200000),
    addr2.address,
    0,
    randomBytes(32)
  );
  console.log("FakeUSDTe deployed to:", fakeUSDTe.address);

  // Deploy Square with proxy
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const square = await upgrades.deployProxy(Square, [
    owner.address,
    fakeUSDTe.address,
  ]);
  await square.deployed();
  console.log("Square deployed to:", square.address);

  // Transfer some USDTe to addr1 and addr2
  await fakeUSDTe.transfer(addr1.address, inToken(100000));
  console.log("100000 USDTe sent to:", addr1.address);
  await fakeUSDTe.transfer(addr2.address, inToken(10000));
  console.log("10000 USDTe sent to:", addr2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
