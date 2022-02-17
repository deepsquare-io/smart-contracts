const { expect, spy } = require("chai");
const { ethers } = require("hardhat");
const dpsFundRaiserHelper = require("../scripts/helpers/dps-fund-raiser");
const deepSquareTokenHelper = require("../scripts/helpers/deep-square-token");
const usdtHelper = require("../scripts/helpers/usdt");
const { inToken, e6 } = require("../scripts/helpers/in-token");
const { faker } = require("@faker-js/faker");
const messagesHelper = require("./messages.helper");
function describeRevert(callback) {
  describe("should revert if", callback);
}

function describeOk(callback) {
  describe("if everything ok", callback);
}

function itSets(callback) {
  it("sets", callback);
}

function greaterThanBytes(numBytes) {
  return 2 ** numBytes + Math.random() * 2 ** (numBytes - 1);
}

function lessThanBytes(numBytes) {
  return 2 ** (numBytes - 1);
}

describe("DpsFundRaiser", function () {
  let dpsFundRaiser;
  let deepSquareToken;
  let fakeUSDT;
  let owner;
  let addr1;
  let addr2;
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy FakeUSDT
    const fakeUSDT = await usdtHelper.deploy();
    deepSquareToken = await deepSquareTokenHelper.deploy();
    // Deploy DpsFundRaiser
    dpsFundRaiser = await dpsFundRaiserHelper.deploy(
      deepSquareToken.address,
      fakeUSDT.address,
      // TODO if I increase maximum, it fails, why ?
      faker.datatype.number({ min: 0, max: 20000 })
    );

    // Fund owner account
    await usdtHelper.mint(fakeUSDT, owner.address, inToken(20000));
    // Transfer some usdt to addr1 and addr2
    await fakeUSDT.transfer(addr1.address, inToken(10000));
    await fakeUSDT.transfer(addr2.address, inToken(8000));
  });

  describe("#initializer", function () {
    describeRevert(function () {});
    describeOk(function () {
      it(
        "should initialize the right addresses (check USDT and DPS addresses)"
      );
    });
  });

  describe("#getRemainingDpsInPhase", function () {});
  describe("#setcUsd  PerDps", function () {
    itSets(function () {}); // TODO for all
  });

  describe("#setNextFundingCap", function () {
    itSets(function () {});
  });

  describe("#setStableCoinContractAddress", function () {
    itSets(function () {});
  });

  describe("#fundViaUSDT", function () {
    describeRevert(function () {
      it("caller is the owner", async function () {
        dpsFundRaiser.connect(addr1);
        await expect(
          dpsFundRaiser.fundViaUSDT(
            faker.datatype.string,
            // TODO make better faker edge values
            faker.datatype.number({ min: 0, max: 1000000 })
          )
        ).to.be.revertedWith("Caller cannot be the owner");
      });

      it("usdt amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("dps amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("next funding cap is reached");
    });
    describeOk(function () {
      it("should withdraw USDT account");
      it("should fund DPS account according to ratio");
      it("should increase fundingCapCurrentState");
      it("should revert all if one transaction goes wrong TODO");
      it("can we test the overflows / edge values ?");
    });
  });

  describe("#fundViaReference", function () {
    let REFERENCE;
    let AMOUNT_DPS;
    // add one reference
    beforeEach(async function () {
      REFERENCE = faker.datatype.string();
      AMOUNT_DPS = faker.datatype.number();
      await dpsFundRaiser.setReference(REFERENCE);
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          dpsFundRaiser
            .connect(addr1)
            .fundViaReference(REFERENCE, faker.datatype.number())
        ).to.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });
      it("usdt amount exceeds 32 bytes", async function () {
        const fk = greaterThanBytes(32);
        await expect(
          dpsFundRaiser.fundViaReference(REFERENCE, fk)
        ).to.be.reverted;
      });
      // TODO, it bugs
      it("next funding cap is reached", async function () {
        const DIFFERENCE = faker.datatype.number({ max: 100000 }); // TODO change
        const CURRENT_FUNDING = await dpsFundRaiser.currentFunding();
        dpsFundRaiser.setNextFundingCap(CURRENT_FUNDING + DIFFERENCE);
        await expect(
          dpsFundRaiser.fundViaReference(
            REFERENCE,
            faker.datatype.number({ min: CURRENT_FUNDING + DIFFERENCE + 1 })
          )
        ).to.be.revertedWith(
          "No more DPS available for distribution in this funding phase"
        );
      });

      it("there is no address matching reference", async function () {
        await expect(
          dpsFundRaiser.fundViaReference(faker.datatype.string(), AMOUNT_DPS)
        ).to.be.revertedWith("Reference does not exist");
      });
    });
    describeOk(function () {
      it("should fund DPS account with specified amount");
      it("should increase currentFunding variable", async function () {
        const CURRENT_FUNDING = await dpsFundRaiser.currentFunding;
        await dpsFundRaiser.fundViaReference(REFERENCE, AMOUNT_DPS);
        await expect(dpsFundRaiser.currentFunding).to.equal(
          CURRENT_FUNDING + AMOUNT_DPS
        );
      });
      it("should revert if funding goes wrong TODO");
    });
  });

  describe.skip("previous tests", function () {
    it("Will it be square", async function () {
      const ownerBalance = await dpsFundRaiser.balanceOf(owner.address);
      expect(ownerBalance).to.equal(inToken(210).mul(e6));
    });

    it("can set iban", async function () {
      const iban = "yolo mon iban";
      await dpsFundRaiser.setIban(iban);
      const receivedIban = await dpsFundRaiser.getIban();
      console.log(receivedIban);
      expect(receivedIban).to.equal(iban);
    });

    it("Owner give away", async function () {
      // Amount of token to transfer (in token, not in wei)
      const amount = 150;
      await dpsFundRaiser.transfer(addr1.address, inToken(amount));
      expect(await dpsFundRaiser.balanceOf(addr1.address)).to.equal(
        inToken(amount)
      );
    });
    it("Others can not transfer", async function () {
      // Amount of token to transfer (in token, not in wei)
      const amount = 2000;
      await dpsFundRaiser.transfer(addr1.address, inToken(amount));
      await expect(
        dpsFundRaiser.connect(addr1).transfer(owner.address, inToken(10))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Owner sets iban", async function () {
      // Amount of token to transfer (in token, not in wei)
      const iban = "xxxxx";
      await dpsFundRaiser.setIban(iban);
      expect(await dpsFundRaiser.getIban()).to.equal(iban);
    });
    it("Owner sets reference", async function () {
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const setReferencTx = await dpsFundRaiser
        .connect(addr1)
        .setReference(reference);
      await setReferencTx.wait();
      expect(await dpsFundRaiser.connect(addr1).getCurrentReference()).to.equal(
        reference
      );
    });
    it("Owner transfers with reference", async function () {
      const nextPhaseAmount = inToken(10e5);
      dpsFundRaiser.setNextFundingCap(nextPhaseAmount);
      expect(await dpsFundRaiser.nextFundingCap()).to.equal(nextPhaseAmount);
      const amount = 150;
      await dpsFundRaiser.transfer(addr2.address, inToken(amount));
      expect(await dpsFundRaiser.balanceOf(addr2.address)).to.equal(
        inToken(amount)
      );
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const setReferencTx = await dpsFundRaiser
        .connect(addr2)
        .setReference(reference);
      await setReferencTx.wait();
      expect(await dpsFundRaiser.connect(addr2).getCurrentReference()).to.equal(
        reference
      );
      const setReferencTx2 = await dpsFundRaiser
        .connect(owner)
        .transferWithReference(reference, inToken(1000));
      await setReferencTx2.wait();
      expect(await dpsFundRaiser.balanceOf(addr2.address)).to.equal(
        inToken(1000 + amount)
      );
      expect(await dpsFundRaiser.getRemainingDPSInPhase()).to.equal(
        nextPhaseAmount - inToken(1000)
      );
    });
    // TODO Julien : test removed because connect function does not exist anymore (Solidity 0.8.0 instead of 0.4.0)
    it.skip("User participates to fundraising after setting reference", async function () {
      const nextPhaseAmount1 = inToken(10000);
      dpsFundRaiser.setNextFundingCap(nextPhaseAmount1);
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const referenceAddr2 = "cb3f5143-56c7-5c67-1207-10eeb3d051d2";
      const referenceWrong = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const cUsdtPerSquare = await dpsFundRaiser.cUsdtPerSquare();
      // Set reference for addr 1
      const setReferencTx = await dpsFundRaiser
        .connect(addr1)
        .setReference(reference);
      await setReferencTx.wait();
      // Fund via usdt
      // We have maximum 10000 token available (e.g. 2000 dollar max funding before the contract rejects)
      await fakeUSDT
        .connect(addr1)
        .approve(dpsFundRaiser.address, inToken(500));
      // // Cannot fund more than allowance
      await expect(
        dpsFundRaiser.connect(addr1).fundViaUSDT(reference, inToken(501))
      ).to.be.revertedWith("");
      // // Cannot fund to wrong allowance
      await expect(
        dpsFundRaiser.connect(addr1).fundViaUSDT(referenceWrong, inToken(501))
      ).to.be.revertedWith("Square::caller must be the registered address");
      // // // Can fund correct amount and receives back the correct amount of token
      await dpsFundRaiser.connect(addr1).fundViaUSDT(reference, inToken(500));
      expect(
        await dpsFundRaiser.connect(addr1).balanceOf(addr1.address)
      ).to.equal(inToken((500 * 100) / cUsdtPerSquare));
      await fakeUSDT
        .connect(addr1)
        .approve(dpsFundRaiser.address, inToken(1501));
      // Purchasing all the remaining token in this phase
      await dpsFundRaiser.connect(addr1).fundViaUSDT(reference, inToken(1500));
      expect(
        await dpsFundRaiser.connect(addr1).balanceOf(addr1.address)
      ).to.equal(inToken((2000 * 100) / cUsdtPerSquare));
      // Limit is reached even purchasing for 1 pDPS
      await expect(
        dpsFundRaiser.connect(addr1).fundViaUSDT(reference, 1)
      ).to.be.revertedWith(
        "Square::no more DPS available for distribution in this step. Wait the next step in order to continue funding"
      );
      // Increase limit
      await fakeUSDT.connect(addr1).approve(dpsFundRaiser.address, 0);
      await fakeUSDT
        .connect(addr1)
        .approve(dpsFundRaiser.address, inToken(1000));
      const nextPhaseAmount = inToken(10e5);
      dpsFundRaiser.setNextFundingCap(nextPhaseAmount);
      expect(await dpsFundRaiser.nextFundingCap()).to.equal(nextPhaseAmount);
      // Increase Price
      const cUsdtPerSquareNew = 40;
      await dpsFundRaiser.setcUsdtPerSquare(cUsdtPerSquareNew);
      expect(await dpsFundRaiser.cUsdtPerSquare()).to.equal(cUsdtPerSquareNew);
      // Cannot get token for usdt that you don't have
      await expect(
        dpsFundRaiser.connect(addr1).fundViaUSDT(reference, inToken(10e4))
      ).to.be.revertedWith("");
      // Participate with second address
      await expect(
        dpsFundRaiser.connect(addr2).fundViaUSDT(reference, 1000)
      ).to.be.revertedWith("Square::caller must be the registered address");
      await expect(
        dpsFundRaiser.connect(addr2).setReference(reference)
      ).to.be.revertedWith("Reference: already used");
      await dpsFundRaiser.connect(addr2).setReference(referenceAddr2);
      await fakeUSDT.connect(addr2).approve(dpsFundRaiser.address, inToken(0));
      await fakeUSDT
        .connect(addr2)
        .approve(dpsFundRaiser.address, inToken(inToken(1000)));
      await dpsFundRaiser
        .connect(addr2)
        .fundViaUSDT(referenceAddr2, inToken(1000));
      expect(
        await dpsFundRaiser.connect(addr2).balanceOf(addr2.address)
      ).to.equal(inToken((1000 * 100) / cUsdtPerSquareNew));
    });
    it("Has a lower and upper limit for purchases", async function () {
      // TODO
    });
  });
});
