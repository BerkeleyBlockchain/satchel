const User = artifacts.require("User");
const MockERC20 = artifacts.require("MockERC20");
const MockCERC20 = artifacts.require("MockCERC20");
const expect = require("chai").expect;

contract("User", async (accounts) => {
  let contract;
  let mockERC20 = await MockERC20.deployed();
  let mockCERC20 = await MockCERC20.deployed();
  let schoolAddress = "0x0000000000000000000000000000000000000001";
  let contractName = "Contract Name";
  let depositAmount = 0x01;
  let withdrawAmount = 0xff;

  beforeEach(async () => {
    contract = await User.new(schoolAddress, contractName);
  });

  describe("constants", () => {
    it("has a name", async () => {
      const name = await contract.name();

      expect(name).to.be.equal(contractName);
    });
    it("has a schoolAddress", async () => {
      const addr = await contract.schoolContract();

      expect(addr).to.be.equal(schoolAddress);
    });
    it("has an owner", async () => {
      const owner = await contract.owner();

      expect(owner).to.be.equal(accounts[0]);
    });
  });

  describe("deposit", () => {
    it("makes a deposit", async () => {
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCERC20.address,
        depositAmount
      );

      const tx = await contract.deposit(
        mockERC20.address,
        mockCERC20.address,
        depositAmount
      );

      expect(amount.toNumber()).to.be.equal(depositAmount);
      expect(typeof tx).to.be.equal("object");
    });
  });

  describe("checkHasEnough", () => {
    it("checks balance", async () => {
      const hasBalance = await contract.checkHasEnough.call(
        withdrawAmount,
        mockCERC20.address
      );
      expect(hasBalance).to.be.equal(false);
    });
  });

  describe("interestRate", () => {
    it("gets the interest rate", async () => {
      const rate = await contract.interestRate.call(mockCERC20.address);

      expect(rate.toNumber()).to.be.equal(1);
    });
  });

  describe("withdraw", () => {
    it("does not have enough balance", async () => {
      const success = await contract.withdraw.call(
        withdrawAmount,
        mockCERC20.address
      );

      const tx = await contract.withdraw(withdrawAmount, mockCERC20.address);

      expect(success).to.be.equal(false);
      expect(tx.logs[0].event).to.be.equal("InsufficientBalance");
    });
  });
});
