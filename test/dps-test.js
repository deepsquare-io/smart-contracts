const chai = require("chai");
const expect = chai.expect;

const { ethers } = require("hardhat");
const dpsHelper = require("../scripts/helpers/dps");
describe("DPS contract", function () {
  let dps;
  let owner;
  let addr1;
  let addr2;
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy DPS
    dps = await dpsHelper.deploy();
  });

  it("setup : owner account balance should be 210'000'000 DPS", async function () {
    const ownerBalance = await dps.balanceOf(owner.address);
    expect(ownerBalance).to.equal(210000000);
  });

  it("transfer() cannot be executed from non admin user", async function () {
    const dpsRandomUser = await dps.connect(addr1);

    const nonOwnerResponse =
      "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'";
    await expect(
      dpsRandomUser.transfer(addr1.address, 2403)
    ).to.be.revertedWith(nonOwnerResponse);
  });

  describe("it should act as an ERC20 token", async function () {
    it("TODO");
  });
});
