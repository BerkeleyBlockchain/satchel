const MockERC20 = artifacts.require("MockERC20");
const expect = require("chai").expect;

contract("MockERC20", (accounts) => {
  let contract;
  let zeroAddress = "0x0000000000000000000000000000000000000000";
  let withdrawAmount = 0x01;
  let transferAmount = 0x0f;

  beforeEach(async () => {
    contract = await MockERC20.deployed();
  });

  describe("approve", () => {
    it("automatically approves all requests", async () => {
      const approved = await contract.approve(zeroAddress, withdrawAmount);

      expect(approved).to.be.equal(true);
    });
  });

  describe("transfer", () => {
    it("automatically approves all transfers", async () => {
      const transfer = await contract.transfer(zeroAddress, transferAmount);

      expect(transfer).to.be.equal(true);
    });
  });
});
