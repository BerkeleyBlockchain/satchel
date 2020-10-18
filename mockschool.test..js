const MockSchool = artifacts.require("MockSchool");
const expect = require("chai").expect;

contract("MockSchool", (accounts) => {
  let contract;
  let zeroAddress = "0x0000000000000000000000000000000000000000";
  let withdrawAmount = 0x01;
  let transferAmount = 0x0f;

  beforeEach(async () => {
    contract = await MockSchool.deployed();
  });

  describe("transfer", () => {
    it("automatically approves all transfers", async () => {
      const transfer = await contract.transfer(transferAmount);

      const balance = await contract.getBalance();

      expect(balance.toNumber()).to.be.equal(transferAmount);
    });
  });
});
