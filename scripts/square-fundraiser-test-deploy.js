// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { randomBytes } = require("ethers/lib/utils");
const hre = require("hardhat");
const ethers = hre.ethers;
const { BigNumber } = ethers;

const e6 = BigNumber.from(10).pow(6);
// const e18 = BigNumber.from(10).pow(18)

const inToken = (value) => {
  return BigNumber.from(value).mul(e6);
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  var owner, addr1, addr2, addrs;
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  // Deploy & fund FakeUSDTe
  const FakeUSDTe = await ethers.getContractFactory("BridgeToken");
  const fakeUSDTe = await FakeUSDTe.deploy();
  await fakeUSDTe.deployed();

  console.log("a", owner.address);
  console.log("b", addr1.address);
  console.log("c", addr2.address);
  // Fund owner account
  await fakeUSDTe.mint(
    owner.address,
    inToken(200000),
    addr2.address,
    0,
    randomBytes(32)
  );
  console.log("FakeUSDTe deployed to:", fakeUSDTe.address);

  // Deploy Square
  const Square = await ethers.getContractFactory("SquareFundRaiser");
  const square = await Square.deploy(owner.address, fakeUSDTe.address);
  await square.deployed();
  console.log("Square deployed to:", square.address);
  // Transfer some USDTe to addr1 and addr2
  await fakeUSDTe.transfer(addr1.address, inToken(100000));
  console.log("100000 USDTe sent to:", addr1.address);
  await fakeUSDTe.transfer(addr2.address, inToken(10000));
  console.log("10000 USDTe sent to:", addr2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
