const { expect } = require("chai");
const { ethers } = require("hardhat");
const crowdsaleDpsHelper = require("../scripts/helpers/crowdsale-dps");
const {
  deployDeepSquareToken,
} = require("../scripts/helpers/deep-square-token");
const usdtHelper = require("../scripts/helpers/usdt");
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
    fakeUSDT = await usdtHelper.deploy();
    // Deploy DPS
    deepSquareToken = await deployDeepSquareToken();
    // Deploy CrowdsaleDps
    crowdsaleDps = await crowdsaleDpsHelper.deploy(
      crowdsaleDpsRatio, // TODO: rate to change
      deepSquareToken.address,
      fakeUSDT.address,
      // TODO if I increase maximum, it fails, why ?
      faker.datatype.number({ min: 0, max: 20000 })
    );

    // Fund owner account
    await usdtHelper.mint(fakeUSDT, owner.address, usdtHelper.token(2201));
    // Transfer some usdt to addr1 and addr2
    await fakeUSDT.transfer(addr1.address, usdtHelper.token(100));
    await fakeUSDT.transfer(addr2.address, usdtHelper.token(100));
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

  describe("#setReference", function () {
    describeRevert(function () {
      it("reference already exists", async function () {
        const reference = faker.datatype.string();
        await crowdsaleDps.setReference(reference);
        expect(await crowdsaleDps.addressFromReference(reference)).to.equal(
          owner.address
        );
        await expect(crowdsaleDps.setReference(reference)).to.be.revertedWith("CrowdsaleDps: reference already used");
      });
    });
  });

  describe("#buyTokens", function () {
    describeRevert(function () {
      it("caller is the owner TODO or not ? maybe it can help at the end ?", async function () {
        await expect(
          crowdsaleDps.buyTokens(owner.address, 23)
        ).to.be.revertedWith("CrowdsaleDps: caller cannot be the owner");
      });
      it("caller is not KYC registered", async function () {
        await expect(
          crowdsaleDps.connect(addr1).buyTokens(addr2.address, 23)
        ).to.be.revertedWith("CrowdsaleDps: caller is not KYC registered");
      });

      it("usdt amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("dps amount exceeds 96 bytes"); // TODO why 96 bytes ?
      it("next funding cap is reached");
    });
    describeOk(function () {
      let CROWDSALE_DPS_FUND;
      beforeEach(async function () {
        CROWDSALE_DPS_FUND = 303222222222;
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        await deepSquareToken.transfer(
          crowdsaleDps.address,
          CROWDSALE_DPS_FUND
        );
        await crowdsaleDps.connect(addr1).setReference("REFERENCE");
      });
      it("should transfer DPS according to USDT/DPS ratio and transfer USDT", async function () {
        const USDT = 3000;
        const BALANCE_ADDR1_USDT = parseInt(
          await fakeUSDT.balanceOf(addr1.address)
        );
        const BALANCE_OWNER_USDT = parseInt(
          await fakeUSDT.balanceOf(owner.address)
        );

        await fakeUSDT.connect(addr1).approve(crowdsaleDps.address, USDT);
        await crowdsaleDps.connect(addr1).buyTokens(addr1.address, USDT);
        expect(await deepSquareToken.balanceOf(addr1.address)).to.equal(
          USDT * crowdsaleDpsRatio
        );

        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          CROWDSALE_DPS_FUND - USDT * crowdsaleDpsRatio
        );

        expect(await fakeUSDT.balanceOf(addr1.address)).to.equal(
          BALANCE_ADDR1_USDT - USDT
        );
        expect(await fakeUSDT.balanceOf(owner.address)).to.equal(
          BALANCE_OWNER_USDT + USDT
        );
      });
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
          crowdsaleDps
            .connect(addr1)
            .transferTokensViaReference(REFERENCE, faker.datatype.number())
        ).to.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });
      it("usdt amount exceeds 32 bytes");
      it("not enough funds on crowdsaleDps", async function () {
        // const DIFFERENCE = faker.datatype.number({ max: 100000 }); // TODO change
        // const CURRENT_FUNDING = await crowdsaleDps.currentFunding();
        await deepSquareToken.grantAccess(crowdsaleDps.address);

        await expect(
          crowdsaleDps.transferTokensViaReference(
            REFERENCE,
            faker.datatype.number({ min: 10 })
          )
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });

      it("there is no address matching reference", async function () {
        await expect(
          crowdsaleDps.transferTokensViaReference(
            faker.datatype.string(),
            AMOUNT_DPS
          )
        ).to.be.revertedWith("CrowdsaleDps: caller is not KYC registered");
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
        await crowdsaleDps.transferTokensViaReference(REFERENCE, USDT);
        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          CROWDSALE_DPS_FUND - USDT * crowdsaleDpsRatio
        );
      });
      it("should revert if funding goes wrong TODO");
      it(
        "should not accept transfer less than ?? TODO, or keep in the web interface ?"
      );

      it("owner can withdraw DPS from contract");
    });
  });
});
