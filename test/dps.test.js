const chai = require("chai");
const expect = chai.expect;

const { ethers } = require("hardhat");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../scripts/helpers/deep-square-token");

const messageHelper = require("./messages.helper");
const { describeRevert, describeOk } = require("./test.helper");
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

  describe("#transfer", function () {
    describeRevert(function () {
      it("caller is not in the allowList", async function () {
        await expect(
          deepSquareToken.connect(addr1).transfer(addr1.address, 2403)
        ).to.be.revertedWith(messageHelper.ERROR_NON_ALLOW_LIST);
      });
    });
  });

  describe("#grantAccess", async function () {
    beforeEach(async function () {
      // mint addresses
      await deepSquareToken.transfer(addr1.address, dpsToken(10000));
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          deepSquareToken.connect(addr1).grantAccess(addr2.address)
        ).to.be.revertedWith(messageHelper.ERROR_NON_OWNER);
      });
    });
   
    describeOk(function () {
      it("gives access to transfer tokens", async function () {
        // no access, reverted
        await expect(
          deepSquareToken.connect(addr1).transfer(addr2.address, 23)
        ).to.be.revertedWith(messageHelper.ERROR_NON_ALLOW_LIST);

        // grant access
        await deepSquareToken.grantAccess(addr1.address);
        // access, not reverted
        await deepSquareToken.connect(addr1).transfer(addr2.address, 1);
        /*
      await expect(deepSquareToken.connect(addr1).transfer(addr2.address, 23))
      .not.be.reverted;
      */
      });
    });
  });
  describe("#revokeAccess", async function () {
    beforeEach(async function () {
      // mint addresses
      await deepSquareToken.transfer(addr1.address, dpsToken(10000));
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          deepSquareToken.connect(addr1).grantAccess(addr2.address)
        ).to.be.revertedWith(messageHelper.ERROR_NON_OWNER);
      });
      it("owner revoke his own access", async function () {
        await expect(
          deepSquareToken.revokeAccess(owner.address)
        ).to.be.revertedWith("DeepSquareToken: owner cannot be revoked");
      });
    });
    describeOk(function () {
      it("revokes access to transfer tokens", async function () {
        // gives access to user1, transfer is not reverted
        await deepSquareToken.grantAccess(addr1.address);
        await expect(
          deepSquareToken.connect(addr1).transfer(addr2.address, 23)
        ).not.be.reverted;

        // revoke access
        await deepSquareToken.revokeAccess(addr1.address);
        // access, not reverted
        await expect(
          deepSquareToken.connect(addr1).transfer(addr2.address, 23)
        ).to.be.revertedWith(messageHelper.ERROR_NON_ALLOW_LIST);
      });
    });
  });

  // TODO: if whitelist is mapping, then it can be hard to know which user is in whitelist. Check in snowtrace ?
});
