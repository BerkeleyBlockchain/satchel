const User = artifacts.require("User");
const MockERC20 = artifacts.require("MockERC20");
const MockCERC20 = artifacts.require("MockCERC20");

contract("User", async (accounts) => {
  let contract;
  let mockERC20 = await MockERC20.deployed();
  let mockCERC20 = await MockCERC20.deployed();
  let schoolAddress = "0x0000000000000000000000000000000000000001";
  let contractName = "Name";
  let zeroAddress = "0x0000000000000000000000000000000000000000";

  beforeEach(async () => {
    contract = await User.new(schoolAddress, contractName);
  });

  describe("constants", () => {
    it("has a schoolAddress", async () => {
      console.log(contract.methods);
    });
  });
});
