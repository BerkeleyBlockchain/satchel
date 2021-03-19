const UnicefSatchel = artifacts.require("UnicefSatchel");
const chai = require("chai");
const expect = chai.expect;
var BN = require("bn.js");
var bnChai = require("bn-chai");
const { assert } = require("chai");
chai.use(bnChai(BN));

contract("UnicefSatchel", (accounts) => {
  const [owner, alice, bob] = accounts;
  const schoolName = "School Name";
  const schoolName2 = "Second School Name";
  const erc20Address = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";

  let contractInstance;
  beforeEach(async () => {
    contractInstance = await UnicefSatchel.new();
  });
  context("Schools", async () => {
    it("Users should be able to create new schools", async () => {
      let events = await contractInstance.newSchool(schoolName, {
        from: owner,
      });
      expect(events.logs[0].args.schoolName).to.equal(schoolName);
      expect(events.logs[0].args.schoolId).to.eq.BN(0);

      events = await contractInstance.newSchool(schoolName2, {
        from: owner,
      });
      expect(events.logs[0].args.schoolName).to.equal(schoolName2);
      expect(events.logs[0].args.schoolId).to.eq.BN(1);
    });

    it("Users should be able to retrieve information about schools", async () => {
      let events = await contractInstance.newSchool(schoolName, {
        from: owner,
      });
      expect(events.logs[0].args.schoolName).to.equal(schoolName);
      expect(events.logs[0].args.schoolId).to.eq.BN(0);

      let name = await contractInstance.getSchoolName(0);
      expect(name).to.equal(schoolName);
    });

    it("Users should be able to get all schools owned", async () => {
      await contractInstance.newSchool(schoolName, {
        from: owner,
      });
      await contractInstance.newSchool(schoolName, {
        from: alice,
      });

      await contractInstance.newSchool(schoolName2, {
        from: owner,
      });

      let ownerOwned = await contractInstance.getSchoolByOwner(owner);
      expect(ownerOwned[0]).to.eq.BN(0);
      expect(ownerOwned[1]).to.eq.BN(2);
      expect(ownerOwned.length).to.equal(2);

      let aliceOwned = contractInstance.getSchoolByOwner(alice);
      expect(aliceOwned[0]).to.eq.BN(1);
    });
  });
});