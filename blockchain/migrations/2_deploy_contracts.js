const UnicefSatchel = artifacts.require("./UnicefSatchel.sol");

// let schoolContract = "0xEC2DD0d0b15D494a58653427246DC076281C377a";

module.exports = function (deployer) {
  deployer.deploy(UnicefSatchel, "UnicefSatchel");
};
