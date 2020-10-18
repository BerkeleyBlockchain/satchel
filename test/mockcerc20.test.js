const MockCERC20 = artifacts.require("MockCERC20");
const expect = require("chai").expect;

contract("MockCERC20", (accounts) => {
  let contract;
  let zeroAddress = "0x0000000000000000000000000000000000000000";
  let mintAmount = 0xff;
  let redeemAmount = 0xffff;
  let setBal = 0xff;
  let setExchange = 0xff;

  beforeEach(async () => {
    contract = await MockCERC20.deployed();
  });

  describe("mint", () => {
    it("always mints the amount", async () => {
      const minted = await contract.mint(mintAmount);

      expect(minted.toNumber()).to.be.equal(0);
    });
  });

  describe("balanceOfUnderlying", () => {
    it("is always 1", async () => {
      const balance = await contract.balanceOfUnderlying(zeroAddress);

      expect(balance.toNumber()).to.be.equal(1);
    });
  });

  describe("updateBalance", () => {
    it("sets balanceOfUnderlying", async () => {
      const amount = await contract.setBalance(setBal);
      const balance = await contract.balanceOfUnderlying(zeroAddress);

      expect(balance.toNumber()).to.be.equal(setBal);
    });
  });

  describe("exchangeRateCurrent", () => {
    it("is always 1", async () => {
      const rate = await contract.exchangeRateCurrent();

      expect(rate.toNumber()).to.be.equal(1);
    });
  });

  describe("setExchangeRate", () => {
    it("sets exchangeRate", async () => {
      const amount = await contract.setExchangeRate(setExchange);
      const rate = await contract.exchangeRateCurrent();

      expect(rate.toNumber()).to.be.equal(setExchange);
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

      expect(amount.toNumber()).to.be.equal(0);
    });
  });

  describe("redeemUnderlying", () => {
    it("always redeems the underlying amount", async () => {
      const amount = await contract.redeemUnderlying(redeemAmount);

      expect(amount.toNumber()).to.be.equal(0);
    });
  });
});
