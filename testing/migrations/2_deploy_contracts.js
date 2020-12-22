const MockERC20 = artifacts.require("MockERC20");
const MockCERC20 = artifacts.require("MockCERC20");
const MockSchool= artifacts.require("MockSchool");
const User = artifacts.require("User");

let zeroAddress = "0x0000000000000000000000000000000000000000";

module.exports = function (deployer) {
  deployer.deploy(MockERC20);
  deployer.deploy(MockCERC20);
  deployer.deploy(MockSchool);
  deployer.deploy(User, zeroAddress, "test");
};
