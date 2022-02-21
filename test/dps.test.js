const chai = require("chai");
const expect = chai.expect;

const { ethers } = require("hardhat");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../scripts/helpers/deep-square-token");

const messageHelper = require("./messages.helper");
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
    deepSquareToken = await deployDeepSquareToken();
  });

  it("setup : owner account balance should be 210'000'000 DPS", async function () {
    const ownerBalance = await deepSquareToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(dpsToken(210000000));
  });

  describe("after setup", function () {
    beforeEach(async function () {
      // mint addresses
      await deepSquareToken.transfer(addr1.address, dpsToken(10000));
    });

    it("transfer() cannot be executed from non whitelist", async function () {
      await expect(
        deepSquareToken.connect(addr1).transfer(addr1.address, 2403)
      ).to.be.revertedWith("DeepSquareToken: user not allowed to transfer");
    });

    describe("#grantAccess", async function () {
      it("gives access to transfer tokens", async function () {
        // no access, reverted
        await expect(
          deepSquareToken.connect(addr1).transfer(addr2.address, 23)
        ).to.be.revertedWith("DeepSquareToken: user not allowed to transfer");

        // grant access
        await deepSquareToken.grantAccess(addr1.address);
        // access, not reverted
        await expect(deepSquareToken.connect(addr1).transfer(addr2.address, 23))
          .not.be.reverted;
      });
      it("can only be accessed by owner", async function () {
        await expect(
          deepSquareToken.connect(addr1).grantAccess(addr2.address)
        ).to.be.revertedWith(messageHelper.ERROR_NON_OWNER);
      });
    });
    describe("#revokeAccess", async function () {
      it("revokes access to transfer tokens", async function () {
        // gives access to user1, transfer is not reverted
        await deepSquareToken.grantAccess(addr1.address);
        await expect(deepSquareToken.connect(addr1).transfer(addr2.address, 23))
          .not.be.reverted;

        // revoke access
        await deepSquareToken.revokeAccess(addr1.address);
        // access, not reverted
        await expect(
          deepSquareToken.connect(addr1).transfer(addr2.address, 23)
        ).to.be.revertedWith("DeepSquareToken: user not allowed to transfer");
      });
      it("owner cannot revoke his own access", async function () {
        await expect(
          deepSquareToken.revokeAccess(owner.address)
        ).to.be.revertedWith("DeepSquareToken: owner cannot be revoked");
      });

      it("can only be accessed by owner", async function () {
        await expect(
          deepSquareToken.connect(addr1).grantAccess(addr2.address)
        ).to.be.revertedWith(messageHelper.ERROR_NON_OWNER);
      });
    });

    it(
      "TODO: if whitelist is mapping, then it can be hard to know which user is in whitelist. Check in snowtrace ?"
    );
  });
});
