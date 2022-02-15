const { expect } = require("chai");
const { ethers } = require("hardhat");
const squareHelper = require("../scripts/helpers/square");
const usdtHelper = require("../scripts/helpers/usdt");
const { inToken, e6 } = require("../scripts/helpers/in-token");

describe("Square", function () {
  let square;
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
    // Deploy Square
    square = await squareHelper.deploy(owner.address, fakeUSDT.address);
    // Fund owner account
    await usdtHelper.mint(fakeUSDT, owner.address, inToken(20000));

    // Transfer some usdt to addr1 and addr2
    await fakeUSDT.transfer(addr1.address, inToken(10000));
    await fakeUSDT.transfer(addr2.address, inToken(8000));
    await square.transfer(owner.address, inToken(2309));
  });

  it("Will it be square", async function () {
    const ownerBalance = await square.balanceOf(owner.address);
    expect(ownerBalance).to.equal(inToken(210).mul(e6));
  });

  it("can set iban", async function () {
    const iban = "yolo mon iban";
    await square.setIban(iban);
    const receivedIban = await square.getIban();
    console.log(receivedIban);
    expect(receivedIban).to.equal(iban);
  });

  it("Owner give away", async function () {
    // Amount of token to transfer (in token, not in wei)
    const amount = 150;
    await square.transfer(addr1.address, inToken(amount));
    expect(await square.balanceOf(addr1.address)).to.equal(inToken(amount));
  });
  it("Others can not transfer", async function () {
    // Amount of token to transfer (in token, not in wei)
    const amount = 2000;
    await square.transfer(addr1.address, inToken(amount));
    await expect(
      square.connect(addr1).transfer(owner.address, inToken(10))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("Owner sets iban", async function () {
    // Amount of token to transfer (in token, not in wei)
    const iban = "xxxxx";
    await square.setIban(iban);
    expect(await square.getIban()).to.equal(iban);
  });
  it("Owner sets reference", async function () {
    // Amount of token to transfer (in token, not in wei)
    const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
    const setReferencTx = await square.connect(addr1).setReference(reference);
    await setReferencTx.wait();
    expect(await square.connect(addr1).getCurrentReference()).to.equal(
      reference
    );
  });
  it("Owner transfers with reference", async function () {
    const nextPhaseAmount = inToken(10e5);
    square.setNextFundingCap(nextPhaseAmount);
    expect(await square.nextFundingCap()).to.equal(nextPhaseAmount);
    const amount = 150;
    await square.transfer(addr2.address, inToken(amount));
    expect(await square.balanceOf(addr2.address)).to.equal(inToken(amount));
    // Amount of token to transfer (in token, not in wei)
    const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
    const setReferencTx = await square.connect(addr2).setReference(reference);
    await setReferencTx.wait();
    expect(await square.connect(addr2).getCurrentReference()).to.equal(
      reference
    );
    const setReferencTx2 = await square
      .connect(owner)
      .transferWithReference(reference, inToken(1000));
    await setReferencTx2.wait();
    expect(await square.balanceOf(addr2.address)).to.equal(
      inToken(1000 + amount)
    );
    expect(await square.getRemainingDPSInPhase()).to.equal(
      nextPhaseAmount - inToken(1000)
    );
  });
  // TODO Julien : test removed because connect function does not exist anymore (Solidity 0.8.0 instead of 0.4.0)
  it.skip("User participates to fundraising after setting reference", async function () {
    const nextPhaseAmount1 = inToken(10000);
    square.setNextFundingCap(nextPhaseAmount1);
    // Amount of token to transfer (in token, not in wei)
    const reference = "bb4f7647-66c7-4c27-a507-25aeb4d057d2";
    const referenceAddr2 = "cb3f5143-56c7-5c67-1207-10eeb3d051d2";
    const referenceWrong = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const cUsdtPerSquare = await square.cUsdtPerSquare();
    // Set reference for addr 1
    const setReferencTx = await square.connect(addr1).setReference(reference);
    await setReferencTx.wait();
    // Fund via usdt
    // We have maximum 10000 token available (e.g. 2000 dollar max funding before the contract rejects)
    await fakeUSDT.connect(addr1).approve(square.address, inToken(500));
    // // Cannot fund more than allowance
    await expect(
      square.connect(addr1).fundViaUSDT(reference, inToken(501))
    ).to.be.revertedWith("");
    // // Cannot fund to wrong allowance
    await expect(
      square.connect(addr1).fundViaUSDT(referenceWrong, inToken(501))
    ).to.be.revertedWith("Square::caller must be the registered address");
    // // // Can fund correct amount and receives back the correct amount of token
    await square.connect(addr1).fundViaUSDT(reference, inToken(500));
    expect(await square.connect(addr1).balanceOf(addr1.address)).to.equal(
      inToken((500 * 100) / cUsdtPerSquare)
    );
    await fakeUSDT.connect(addr1).approve(square.address, inToken(1501));
    // Purchasing all the remaining token in this phase
    await square.connect(addr1).fundViaUSDT(reference, inToken(1500));
    expect(await square.connect(addr1).balanceOf(addr1.address)).to.equal(
      inToken((2000 * 100) / cUsdtPerSquare)
    );
    // Limit is reached even purchasing for 1 pDPS
    await expect(
      square.connect(addr1).fundViaUSDT(reference, 1)
    ).to.be.revertedWith(
      "Square::no more DPS available for distribution in this step. Wait the next step in order to continue funding"
    );
    // Increase limit
    await fakeUSDT.connect(addr1).approve(square.address, 0);
    await fakeUSDT.connect(addr1).approve(square.address, inToken(1000));
    const nextPhaseAmount = inToken(10e5);
    square.setNextFundingCap(nextPhaseAmount);
    expect(await square.nextFundingCap()).to.equal(nextPhaseAmount);
    // Increase Price
    const cUsdtPerSquareNew = 40;
    await square.setcUsdtPerSquare(cUsdtPerSquareNew);
    expect(await square.cUsdtPerSquare()).to.equal(cUsdtPerSquareNew);
    // Cannot get token for usdt that you don't have
    await expect(
      square.connect(addr1).fundViaUSDT(reference, inToken(10e4))
    ).to.be.revertedWith("");
    // Participate with second address
    await expect(
      square.connect(addr2).fundViaUSDT(reference, 1000)
    ).to.be.revertedWith("Square::caller must be the registered address");
    await expect(
      square.connect(addr2).setReference(reference)
    ).to.be.revertedWith("Reference: already used");
    await square.connect(addr2).setReference(referenceAddr2);
    await fakeUSDT.connect(addr2).approve(square.address, inToken(0));
    await fakeUSDT
      .connect(addr2)
      .approve(square.address, inToken(inToken(1000)));
    await square.connect(addr2).fundViaUSDT(referenceAddr2, inToken(1000));
    expect(await square.connect(addr2).balanceOf(addr2.address)).to.equal(
      inToken((1000 * 100) / cUsdtPerSquareNew)
    );
  });
  it("Has a lower and upper limit for purchases", async function () {
    // TODO
  });
});
