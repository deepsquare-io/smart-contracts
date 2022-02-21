const { expect } = require("chai");
const { ethers } = require("hardhat");
const crowdsaleDpsHelper = require("../scripts/helpers/crowdsale-dps");
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

describe("CrowdsaleDps", function () {
  let crowdsaleDps;
  let deepSquareToken;
  let fakeUSDT;
  let owner;
  let addr1;
  let addr2;
  const crowdsaleDpsRatio = 2;
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy FakeUSDT
    const fakeUSDT = await usdtHelper.deploy();
    // Deploy DPS
    deepSquareToken = await deepSquareTokenHelper.deploy();
    // Deploy CrowdsaleDps
    crowdsaleDps = await crowdsaleDpsHelper.deploy(
      crowdsaleDpsRatio, // TODO: rate to change
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

  describe("#buyTokens", function () {
    describeRevert(function () {
      it("caller is the owner TODO or not ?");

      it("usdt amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("dps amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("next funding cap is reached");
    });
    describeOk(function () {
      it("should transfer DPS according to USDT/DPS ratio", async function () {
        const USDT = 3000;
        const CROWDSALE_DPS_FUND = 303222222222;
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        await deepSquareToken.transfer(
          crowdsaleDps.address,
          CROWDSALE_DPS_FUND
        );
        await crowdsaleDps.buyTokens(addr1.address, { value: USDT });
        expect(await deepSquareToken.balanceOf(addr1.address)).to.equal(
          USDT * crowdsaleDpsRatio
        );

        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          CROWDSALE_DPS_FUND - USDT * crowdsaleDpsRatio
        );
      });
      it("should fund DPS account according to ratio");
      it("should increase fundingCapCurrentState");
      it("should revert all if one transaction goes wrong TODO");
      it("can we test the overflows / edge values ?");
      it(
        "SHOULD ESPECIALLY CHECK IF SOMETHING GOES WRONG IF BUYTOKENS BUG TODO"
      );
    });
  });

  describe("#transferTokensViaReference", function () {
    let REFERENCE;
    let AMOUNT_DPS;
    // add one reference
    beforeEach(async function () {
      REFERENCE = faker.datatype.string();
      AMOUNT_DPS = faker.datatype.number();
      await crowdsaleDps.setReference(REFERENCE);
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          crowdsaleDps.connect(addr1).transferTokensViaReference(REFERENCE, {
            value: faker.datatype.number(),
          })
        ).to.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });
      it("usdt amount exceeds 32 bytes");
      it("not enough funds on crowdsaleDps", async function () {
        // const DIFFERENCE = faker.datatype.number({ max: 100000 }); // TODO change
        // const CURRENT_FUNDING = await crowdsaleDps.currentFunding();
        await deepSquareToken.grantAccess(crowdsaleDps.address);

        await expect(
          crowdsaleDps.transferTokensViaReference(REFERENCE, {
            value: faker.datatype.number({ min: 10 }),
          })
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });

      it("there is no address matching reference", async function () {
        await expect(
          crowdsaleDps.transferTokensViaReference(faker.datatype.string(), {
            value: AMOUNT_DPS,
          })
        ).to.be.revertedWith("Reference does not exist");
      });

      it("what happens if no same reference wants to add money twice ?");
    });
    describeOk(function () {
      beforeEach(async function () {
        await deepSquareToken.grantAccess(crowdsaleDps.address);
      });
      it("should fund DPS account with us");
      it("should send DPS according to USDT rate", async function () {
        const USDT = faker.datatype.number({ min: 1000000 });
        const CROWDSALE_DPS_FUND = faker.datatype.number({
          min: USDT + 100000000,
        });
        await deepSquareToken.transfer(
          crowdsaleDps.address,
          CROWDSALE_DPS_FUND
        );
        await crowdsaleDps.transferTokensViaReference(REFERENCE, {
          value: USDT,
        });
        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          CROWDSALE_DPS_FUND - USDT * crowdsaleDpsRatio
        );
      });
      it("should revert if funding goes wrong TODO");
      it(
        "should not accept transfer less than ?? TODO, or keep in the web interface ?"
      );
    });
  });

  describe.skip("previous tests", function () {
    it("Will it be square", async function () {
      const ownerBalance = await crowdsaleDps.balanceOf(owner.address);
      expect(ownerBalance).to.equal(inToken(210).mul(e6));
    });

    it("can set iban", async function () {
      const iban = "yolo mon iban";
      await crowdsaleDps.setIban(iban);
      const receivedIban = await crowdsaleDps.getIban();
      console.log(receivedIban);
      expect(receivedIban).to.equal(iban);
    });

    it("Owner give away", async function () {
      // Amount of token to transfer (in token, not in wei)
      const amount = 150;
      await crowdsaleDps.transfer(addr1.address, inToken(amount));
      expect(await crowdsaleDps.balanceOf(addr1.address)).to.equal(
        inToken(amount)
      );
    });
    it("Others can not transfer", async function () {
      // Amount of token to transfer (in token, not in wei)
      const amount = 2000;
      await crowdsaleDps.transfer(addr1.address, inToken(amount));
      await expect(
        crowdsaleDps.connect(addr1).transfer(owner.address, inToken(10))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Owner sets iban", async function () {
      // Amount of token to transfer (in token, not in wei)
      const iban = "xxxxx";
      await crowdsaleDps.setIban(iban);
      expect(await crowdsaleDps.getIban()).to.equal(iban);
    });
    it("Owner sets reference", async function () {
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const setReferencTx = await crowdsaleDps
        .connect(addr1)
        .setReference(reference);
      await setReferencTx.wait();
      expect(await crowdsaleDps.connect(addr1).getCurrentReference()).to.equal(
        reference
      );
    });
    it("Owner transfers with reference", async function () {
      const nextPhaseAmount = inToken(10e5);
      crowdsaleDps.setNextFundingCap(nextPhaseAmount);
      expect(await crowdsaleDps.nextFundingCap()).to.equal(nextPhaseAmount);
      const amount = 150;
      await crowdsaleDps.transfer(addr2.address, inToken(amount));
      expect(await crowdsaleDps.balanceOf(addr2.address)).to.equal(
        inToken(amount)
      );
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const setReferencTx = await crowdsaleDps
        .connect(addr2)
        .setReference(reference);
      await setReferencTx.wait();
      expect(await crowdsaleDps.connect(addr2).getCurrentReference()).to.equal(
        reference
      );
      const setReferencTx2 = await crowdsaleDps
        .connect(owner)
        .transferWithReference(reference, inToken(1000));
      await setReferencTx2.wait();
      expect(await crowdsaleDps.balanceOf(addr2.address)).to.equal(
        inToken(1000 + amount)
      );
      expect(await crowdsaleDps.getRemainingDPSInPhase()).to.equal(
        nextPhaseAmount - inToken(1000)
      );
    });
    // TODO Julien : test removed because connect function does not exist anymore (Solidity 0.8.0 instead of 0.4.0)
    it.skip("User participates to fundraising after setting reference", async function () {
      const nextPhaseAmount1 = inToken(10000);
      crowdsaleDps.setNextFundingCap(nextPhaseAmount1);
      // Amount of token to transfer (in token, not in wei)
      const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
      const referenceAddr2 = "cb3f5143-56c7-5c67-1207-10eeb3d051d2";
      const referenceWrong = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const cUsdtPerSquare = await crowdsaleDps.cUsdtPerSquare();
      // Set reference for addr 1
      const setReferencTx = await crowdsaleDps
        .connect(addr1)
        .setReference(reference);
      await setReferencTx.wait();
      // Fund via usdt
      // We have maximum 10000 token available (e.g. 2000 dollar max funding before the contract rejects)
      await fakeUSDT.connect(addr1).approve(crowdsaleDps.address, inToken(500));
      // // Cannot fund more than allowance
      await expect(
        crowdsaleDps.connect(addr1).fundViaUSDT(reference, inToken(501))
      ).to.be.revertedWith("");
      // // Cannot fund to wrong allowance
      await expect(
        crowdsaleDps.connect(addr1).fundViaUSDT(referenceWrong, inToken(501))
      ).to.be.revertedWith("Square::caller must be the registered address");
      // // // Can fund correct amount and receives back the correct amount of token
      await crowdsaleDps.connect(addr1).fundViaUSDT(reference, inToken(500));
      expect(
        await crowdsaleDps.connect(addr1).balanceOf(addr1.address)
      ).to.equal(inToken((500 * 100) / cUsdtPerSquare));
      await fakeUSDT
        .connect(addr1)
        .approve(crowdsaleDps.address, inToken(1501));
      // Purchasing all the remaining token in this phase
      await crowdsaleDps.connect(addr1).fundViaUSDT(reference, inToken(1500));
      expect(
        await crowdsaleDps.connect(addr1).balanceOf(addr1.address)
      ).to.equal(inToken((2000 * 100) / cUsdtPerSquare));
      // Limit is reached even purchasing for 1 pDPS
      await expect(
        crowdsaleDps.connect(addr1).fundViaUSDT(reference, 1)
      ).to.be.revertedWith(
        "Square::no more DPS available for distribution in this step. Wait the next step in order to continue funding"
      );
      // Increase limit
      await fakeUSDT.connect(addr1).approve(crowdsaleDps.address, 0);
      await fakeUSDT
        .connect(addr1)
        .approve(crowdsaleDps.address, inToken(1000));
      const nextPhaseAmount = inToken(10e5);
      crowdsaleDps.setNextFundingCap(nextPhaseAmount);
      expect(await crowdsaleDps.nextFundingCap()).to.equal(nextPhaseAmount);
      // Increase Price
      const cUsdtPerSquareNew = 40;
      await crowdsaleDps.setcUsdtPerSquare(cUsdtPerSquareNew);
      expect(await crowdsaleDps.cUsdtPerSquare()).to.equal(cUsdtPerSquareNew);
      // Cannot get token for usdt that you don't have
      await expect(
        crowdsaleDps.connect(addr1).fundViaUSDT(reference, inToken(10e4))
      ).to.be.revertedWith("");
      // Participate with second address
      await expect(
        crowdsaleDps.connect(addr2).fundViaUSDT(reference, 1000)
      ).to.be.revertedWith("Square::caller must be the registered address");
      await expect(
        crowdsaleDps.connect(addr2).setReference(reference)
      ).to.be.revertedWith("Reference: already used");
      await crowdsaleDps.connect(addr2).setReference(referenceAddr2);
      await fakeUSDT.connect(addr2).approve(crowdsaleDps.address, inToken(0));
      await fakeUSDT
        .connect(addr2)
        .approve(crowdsaleDps.address, inToken(inToken(1000)));
      await crowdsaleDps
        .connect(addr2)
        .fundViaUSDT(referenceAddr2, inToken(1000));
      expect(
        await crowdsaleDps.connect(addr2).balanceOf(addr2.address)
      ).to.equal(inToken((1000 * 100) / cUsdtPerSquareNew));
    });
    it("Has a lower and upper limit for purchases", async function () {
      // TODO
    });
  });
});
