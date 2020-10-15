const MockCERC20 = artifacts.require("MockCERC20");
const expect = require("chai").expect;

contract("MockCERC20", (accounts) => {
  let contract;
  let zeroAddress = "0x0000000000000000000000000000000000000000";
  let mintAmount = 0xff;
  let redeemAmount = 0xffff;

  beforeEach(async () => {
    contract = await MockCERC20.deployed();
  });

  describe("mint", () => {
    it("always mints the amount", async () => {
      const minted = await contract.mint(mintAmount);

      expect(minted.toNumber()).to.be.equal(mintAmount);
    });
  });

  describe("balanceOfUnderlying", () => {
    it("is always 0", async () => {
      const balance = await contract.balanceOfUnderlying(zeroAddress);

      expect(balance.toNumber()).to.be.equal(0);
    });
  });

  describe("exchangeRateCurrent", () => {
    it("is always 1", async () => {
      const rate = await contract.exchangeRateCurrent();

      expect(rate.toNumber()).to.be.equal(1);
    });
  });

  describe("supplyRatePerBlock", () => {
    it("is always 0", async () => {
      const supply = await contract.supplyRatePerBlock();

      expect(supply.toNumber()).to.be.equal(0);
    });
  });

  describe("redeem", () => {
    it("always redeems the amount", async () => {
      const amount = await contract.redeem(redeemAmount);

      expect(amount.toNumber()).to.be.equal(redeemAmount);
    });
  });

  describe("redeemUnderlying", () => {
    it("always redeems the underlying amount", async () => {
      const amount = await contract.redeemUnderlying(redeemAmount);

      expect(amount.toNumber()).to.be.equal(redeemAmount);
    });
  });
});
