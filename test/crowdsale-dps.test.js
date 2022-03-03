const { expect } = require("chai");
const { ethers } = require("hardhat");
const crowdsaleDpsHelper = require("../scripts/helpers/crowdsale-dps");
const {
  deployDeepSquareToken,
  dpsToken,
} = require("../scripts/helpers/deep-square-token");
const usdtHelper = require("../scripts/helpers/usdt");
const { faker } = require("@faker-js/faker");
const messagesHelper = require("./messages.helper");
const { describeRevert, describeOk } = require("./test.helper");

describe("CrowdsaleDps contract", function () {
  let crowdsaleDps;
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
    fakeUSDT = await usdtHelper.deploy();
    // Deploy DPS
    deepSquareToken = await deployDeepSquareToken();
    // Deploy CrowdsaleDps
    crowdsaleDps = await crowdsaleDpsHelper.deployMarch22(
      deepSquareToken.address,
      fakeUSDT.address
    );

    // Fund owner account
    await usdtHelper.mint(fakeUSDT, owner.address, usdtHelper.token(10 ** 8));
    // Transfer some usdt to addr1 and addr2
    await fakeUSDT.transfer(addr1.address, usdtHelper.token(10 ** 5));
    await fakeUSDT.transfer(addr2.address, usdtHelper.token(10 ** 5));
  });

  describe("on initialization", function () {
    describeRevert(function () {
      it("dps/usd rate should not be 0", async function () {
        await expect(
          crowdsaleDpsHelper.deploy(
            0,
            deepSquareToken.address,
            fakeUSDT.address
          )
        ).to.be.revertedWith("Crowdsale: rate is 0");
      });

      it("token should not be the 0 address", async function () {
        await expect(
          crowdsaleDpsHelper.deployMarch22(
            messagesHelper.ZERO_ADDRESS,
            fakeUSDT.address
          )
        ).to.be.revertedWith("Crowdsale: token is the zero address");
      });
    });
  });

  describe("#setReference", function () {
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          crowdsaleDps
            .connect(addr1)
            .setReference(
              faker.finance.ethereumAddress(),
              faker.datatype.string()
            )
        ).to.be.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });

      it("reference already exists", async function () {
        const reference = faker.datatype.string();

        await crowdsaleDps.setReference(addr2.address, reference);

        expect(await crowdsaleDps.addressFromReference(reference)).to.equal(
          addr2.address
        );

        await expect(
          crowdsaleDps.setReference(addr2.address, reference)
        ).to.be.revertedWith("CrowdsaleDps: reference already used");
      });
    });
  });

  describe("#removeReference", function () {
    let REFERENCE;
    let ADDRESS;
    beforeEach(async function () {
      REFERENCE = faker.datatype.string();
      ADDRESS = addr1.address;
      await crowdsaleDps.setReference(ADDRESS, REFERENCE);
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          crowdsaleDps.connect(addr2).removeReference(ADDRESS, REFERENCE)
        ).to.be.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });
      it("address does not exist", async function () {
        await expect(
          crowdsaleDps.removeReference(
            faker.finance.ethereumAddress(),
            REFERENCE
          )
        ).to.be.revertedWith(crowdsaleDpsHelper.ADDRESS_NOT_EXIST);
      });

      it("reference does not exist", async function () {
        await expect(
          crowdsaleDps.removeReference(ADDRESS, faker.datatype.string())
        ).to.be.revertedWith("CrowdsaleDps: reference does not exist");
      });
    });

    describeOk(function () {
      it("should remove reference and address mappings", async function () {
        expect(await crowdsaleDps.referenceFromAddress(ADDRESS)).to.equal(
          REFERENCE
        );
        expect(await crowdsaleDps.addressFromReference(REFERENCE)).to.equal(
          ADDRESS
        );
        // call removeReference
        await crowdsaleDps.removeReference(ADDRESS, REFERENCE);
        // reference and address mapping should be empty

        expect(await crowdsaleDps.referenceFromAddress(ADDRESS)).to.equal("");

        expect(await crowdsaleDps.addressFromReference(REFERENCE)).to.equal(
          messagesHelper.ZERO_ADDRESS
        );
      });
    });
  });
  describe("#setOwnReference", function () {
    describeRevert(function () {
      it("reference already exists", async function () {
        const reference = faker.datatype.string();

        await crowdsaleDps.setOwnReference(reference);
        expect(await crowdsaleDps.addressFromReference(reference)).to.equal(
          owner.address
        );

        await expect(
          crowdsaleDps.setOwnReference(reference)
        ).to.be.revertedWith("CrowdsaleDps: reference already used");
      });
    });
  });

  describe("#buyTokens", function () {
    describeRevert(function () {
      it("beneficiary is the zero address", async function () {
        await expect(
          crowdsaleDps.buyTokens(messagesHelper.ZERO_ADDRESS, 23)
        ).to.be.revertedWith("Crowdsale: beneficiary is the zero address");
      });
      it("usdt amount is 0", async function () {
        await expect(
          crowdsaleDps.buyTokens(
            addr2.address,
            faker.datatype.number({ max: 0 })
          )
        ).to.be.revertedWith("Crowdsale: stableCoin amount > 0");
      });
      it("caller is the owner", async function () {
        await expect(
          crowdsaleDps.buyTokens(owner.address, 23)
        ).to.be.revertedWith("CrowdsaleDps: caller cannot be the owner");
      });
      it("caller is not KYC registered", async function () {
        await expect(
          crowdsaleDps.connect(addr1).buyTokens(addr2.address, 23)
        ).to.be.revertedWith(messagesHelper.REFERENCE_ADDRESS_MISMATCH);
      });
    });

    describeOk(function () {
      let CROWDSALE_DPS_FUND;
      beforeEach(async function () {
        // grant transfer DPS access to Crowdsale
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        // fund crowdsale contract
        CROWDSALE_DPS_FUND = dpsToken(10 ** 7);
        await deepSquareToken.transfer(
          crowdsaleDps.address,
          CROWDSALE_DPS_FUND
        );
        await crowdsaleDps.connect(addr1).setOwnReference("REFERENCE");
      });

      describe("should transfer DPS according to USDT/DPS ratio and transfer USDT", function () {
        const examples = [
          { usdt: 400, dps: 1000 },
          { usdt: 1000, dps: 2500 },
          { usdt: 10000, dps: 25000 },
        ];
        examples.forEach(function (v) {
          it(v.usdt + " USDT gives you " + v.dps + " DPS", async function () {
            // get sender and receiver current balances
            const BALANCE_ADDR1_USDT = await fakeUSDT.balanceOf(addr1.address);
            const BALANCE_OWNER_USDT = await fakeUSDT.balanceOf(owner.address);

            // buy tokens
            const USDT = usdtHelper.token(v.usdt);
            const DPS = dpsToken(v.dps);
            await fakeUSDT.connect(addr1).approve(crowdsaleDps.address, USDT);
            await crowdsaleDps.connect(addr1).buyTokens(addr1.address, USDT);

            // check that DPS's sender and receiver balance is correct
            expect(await deepSquareToken.balanceOf(addr1.address)).to.equal(
              DPS
            );
            expect(
              await deepSquareToken.balanceOf(crowdsaleDps.address)
            ).to.equal(CROWDSALE_DPS_FUND.sub(DPS));
            // check that USDT's sender and receiver balance is correct
            expect(await fakeUSDT.balanceOf(addr1.address)).to.equal(
              BALANCE_ADDR1_USDT.sub(USDT)
            );
            expect(await fakeUSDT.balanceOf(owner.address)).to.equal(
              BALANCE_OWNER_USDT.add(USDT)
            );
          });
        });
      });
      // TODO should revert all if one transaction goes wrong TODO"
      // TODO can we test the overflows / edge values ?
      // SHOULD ESPECIALLY CHECK IF SOMETHING GOES WRONG IF BUYTOKENS BUG TODO
    });
  });

  describe("#transferTokensViaReference", function () {
    let REFERENCE;
    let AMOUNT_DPS;
    // add one reference
    beforeEach(async function () {
      REFERENCE = faker.datatype.string();
      AMOUNT_DPS = dpsToken(faker.datatype.number({ min: 1 }));
    });
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          crowdsaleDps
            .connect(addr1)
            .transferTokensViaReference(addr2.address, AMOUNT_DPS, REFERENCE)
        ).to.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });

      it("beneficiary is the owner", async function () {
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        await expect(
          crowdsaleDps.transferTokensViaReference(
            owner.address,
            AMOUNT_DPS,
            REFERENCE
          )
        ).to.be.revertedWith("CrowdsaleDps: caller cannot be the owner");
      });

      it("reference exist but do not match with address", async function () {
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        await crowdsaleDps.setReference(addr1.address, "RANDOM");
        await expect(
          crowdsaleDps.transferTokensViaReference(
            addr1.address,
            AMOUNT_DPS,
            faker.datatype.string()
          )
        ).to.be.revertedWith(messagesHelper.REFERENCE_ADDRESS_MISMATCH);
      });

      // TODO what happens if no same reference wants to add money twice ?")
    });
    describeOk(function () {
      let WEI_AMOUNT, CROWDSALE_DPS_FUND, BENEFICIARY;
      beforeEach(async function () {
        CROWDSALE_DPS_FUND = AMOUNT_DPS.add(
          dpsToken(faker.datatype.number({ min: 1 }))
        );
        BENEFICIARY = addr2.address;

        // grant access to DPS transfer
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        await deepSquareToken.transfer(
          crowdsaleDps.address,
          CROWDSALE_DPS_FUND
        );

        await crowdsaleDps.transferTokensViaReference(
          addr2.address,
          AMOUNT_DPS,
          REFERENCE
        );
      });
      it("should create reference if it does not exists yet", async function () {
        expect(await crowdsaleDps.referenceFromAddress(BENEFICIARY)).to.equal(
          REFERENCE
        );
        expect(await crowdsaleDps.addressFromReference(REFERENCE)).to.equal(
          BENEFICIARY
        );
      });

      it("should send DPS tokens", async function () {
        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          CROWDSALE_DPS_FUND.sub(AMOUNT_DPS)
        );
      });
    });
  });
  describe("#closeCrowdsale", function () {
    describeRevert(function () {
      it("caller is not the owner", async function () {
        await expect(
          crowdsaleDps.connect(addr1).closeCrowdsale()
        ).to.be.revertedWith(messagesHelper.ERROR_NON_OWNER);
      });
    });
    describeOk(function () {
      let reference, address;
      beforeEach(async function () {
        // grant DPS access to CrowdsaleDps contract
        await deepSquareToken.grantAccess(crowdsaleDps.address);
        // add reference
        reference = faker.datatype.string();
        address = addr2.address;
        await crowdsaleDps.setReference(address, reference);
        // transfer money to Crowdsale contract
        await deepSquareToken.transfer(crowdsaleDps.address, dpsToken(1000));
      });
      it("BEFORE DEPLOY, THINK ABOUT GASLESS integration ?");
      it(
        "VERY IMPORTANT !! AFTER DISCUSSION WITH DIARMUID, HOW DO WE DO WITH KYC ? I NEED A KYC FROM DB, AND THEY MANAGE THE PROBLEM IN THE DB ?"
      );
      it("should withdraw contract DPS tokens to owner account", async function () {
        // check initial DPS funds on the contract
        expect(
          await deepSquareToken.balanceOf(crowdsaleDps.address)
        ).to.be.above(0, "initial DPS fund should be 0");
        // call close()
        await crowdsaleDps.closeCrowdsale();
        // check that there are 0 funds in the contract
        expect(await deepSquareToken.balanceOf(crowdsaleDps.address)).to.equal(
          0
        );
      });
      it("should revoke its own access to DPS contract", async function () {
        const transferFn = async function () {
          return crowdsaleDps.transferTokensViaReference(
            address,
            faker.datatype.number({ min: 0 }),
            reference
          );
        };
        // check that we have access to transfer tokens
        await expect(transferFn()).not.be.reverted;
        // call close()
        await crowdsaleDps.closeCrowdsale();
        // check that you cannot transfer tokens anymore
        await expect(transferFn()).to.be.revertedWith(
          "DeepSquareToken: user not in allowList"
        );
      });

      it("can add money two times with same reference");
      it(
        "Test the EVENT crowdsale.sol TokensPurchased(). I need to understand how it works"
      );
    });
  });
});
