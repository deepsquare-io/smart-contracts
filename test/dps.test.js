const chai = require("chai");
const expect = chai.expect;

const { ethers } = require("hardhat");
const deepSquareTokenHelper = require("../scripts/helpers/deep-square-token");
const messagesHelper = require("./messages.helper");

describe("DPS contract", function () {
  let deepSquareToken;
  let owner;
  let addr1;
  let addr2;
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy DPS
    deepSquareToken = await deepSquareTokenHelper.deploy();
  });

  it("setup : owner account balance should be 210'000'000 DPS", async function () {
    const ownerBalance = await deepSquareToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(210000000);
  });

  it("transfer() cannot be executed from non admin user", async function () {
    await expect(
      deepSquareToken.connect(addr1).transfer(addr1.address, 2403)
    ).to.be.revertedWith(messagesHelper.ERROR_NON_OWNER);
  });

  describe("it should act as an ERC20 token", async function () {
    it("TODO");
  });
});
