import hre from "hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signers } from "./types";
import { School } from "../contract_types/School";
import { UnicefSatchel } from '../contract_types/UnicefSatchel';
import { getOverrideOptions } from "./utils";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { deployContract } = hre.waffle;

describe("Unit tests", function () {
    let unicefSatchel: UnicefSatchel;
    let admin: SignerWithAddress;
    let owner: SignerWithAddress;
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    const schoolName = "School Name";
    const schoolName2 = "Second School Name";
    const erc20Address = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
    const userName = "User Name";
    before(async function () {
      this.signers = {} as Signers;
      const signers: SignerWithAddress[] = await hre.ethers.getSigners();
      admin = signers[0];
      owner = signers[1];
      deployer = signers[2];
      alice = signers[3];
      bob = signers[4];
  
      // deploy UnicefSatchel Contract
      const UnicefSatchelArtifact: Artifact = await hre.artifacts.readArtifact("UnicefSatchel");
      this.unicefSatchel = <UnicefSatchel><any>(
        await deployContract(owner, UnicefSatchelArtifact, [], {gasPrice: 1_000_000_00})
      );

      unicefSatchel = this.unicefSatchel;
  
      // // Fund UnicefSatchel with 10 ETH
      // await this.signers.admin.sendTransaction({
      //     // @ts-ignore
      //     to: this.unicefSatchel.address,
      //     value: hre.ethers.utils.parseEther("10"),
      //     ...getOverrideOptions()
      // });
    });

    describe("Schools", () => {
      it("Users should be able to create new schools", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        }); 
        let eventFilter = unicefSatchel.filters.newSchoolEvent();
        let events = await unicefSatchel.queryFilter(eventFilter, "latest");
        expect(events[0].args.schoolName).to.equal(schoolName);
        expect(events[0].args.schoolId).to.eq(0);
  
        await unicefSatchel.newSchool(schoolName2, {
          from: owner.address,
        });
        events = await unicefSatchel.queryFilter(eventFilter, "latest");
        expect(events[0].args.schoolName).to.equal(schoolName2);
        expect(events[0].args.schoolId).to.eq(1);
      });
    });
});

// const UnicefSatchel = artifacts.require("UnicefSatchel");
// const User = artifacts.require("User");
// const chai = require("chai");
// const expect = chai.expect;
// var BN = require("bn.js");
// var bnChai = require("bn-chai");
// const { assert } = require("chai");
// chai.use(bnChai(BN));

// contract("UnicefSatchel", (accounts) => {
//   const [owner, alice, bob] = accounts;
//   const schoolName = "School Name";
//   const schoolName2 = "Second School Name";
//   const erc20Address = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
//   const userName = "User Name";

//   let contractInstance;
//   beforeEach(async () => {
//     contractInstance = await UnicefSatchel.new();
//   });

//   context("Schools", async () => {
//     it("Users should be able to create new schools", async () => {
//       let events = await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });
//       expect(events.logs[0].args.schoolName).to.equal(schoolName);
//       expect(events.logs[0].args.schoolId).to.eq.BN(0);

//       events = await contractInstance.newSchool(schoolName2, {
//         from: owner,
//       });
//       expect(events.logs[0].args.schoolName).to.equal(schoolName2);
//       expect(events.logs[0].args.schoolId).to.eq.BN(1);
//     });

//     it("Users should be able to retrieve information about schools", async () => {
//       let events = await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });
//       expect(events.logs[0].args.schoolName).to.equal(schoolName);
//       expect(events.logs[0].args.schoolId).to.eq.BN(0);

//       let name = await contractInstance.getSchoolName(0);
//       expect(name).to.equal(schoolName);
//     });

//     it("Users should be able to get all schools owned", async () => {
//       await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });
//       await contractInstance.newSchool(schoolName, {
//         from: alice,
//       });

//       await contractInstance.newSchool(schoolName2, {
//         from: owner,
//       });

//       let ownerOwned = await contractInstance.getSchoolByOwner(owner);
//       expect(ownerOwned[0]).to.eq.BN(0);
//       expect(ownerOwned[1]).to.eq.BN(2);
//       expect(ownerOwned.length).to.equal(2);

//       let aliceOwned = await contractInstance.getSchoolByOwner(alice);
//       expect(aliceOwned[0]).to.eq.BN(1);
//       expect(aliceOwned.length).to.equal(1);
//     });

//     it("Schools should be able to check balance", async () => {
//       await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });

//       let balance = await contractInstance.getSchoolBalance(0, erc20Address);
//       expect(balance).to.eq.BN(0);
//     });
//   });

//   context("Users", async () => {
//     it("Users should be able to create users", async () => {
//       await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });

//       const schoolAddress = await contractInstance.schoolArray(0);

//       await contractInstance.createUserContract(userName, schoolAddress, {
//         from: owner,
//       });

//       const userAddress = await contractInstance.getUserContract({
//         from: owner,
//       });
//       let userInstance = await User.at(userAddress);

//       let name = await userInstance.getName();
//       expect(name).to.equal(userName);

//       let address = await userInstance.schoolContract();
//       expect(address).to.equal(schoolAddress);
//     });

//     it("Users should be able to get their balance", async () => {
//       await contractInstance.newSchool(schoolName, {
//         from: owner,
//       });

//       const schoolAddress = await contractInstance.schoolArray(0);

//       await contractInstance.createUserContract(userName, schoolAddress, {
//         from: owner,
//       });

//       const userAddress = await contractInstance.getUserContract({
//         from: owner,
//       });
//       let userInstance = await User.at(userAddress);
//       let balance = await userInstance.getBalance(erc20Address);
//       console.log(balance);
//     });
//   });
// })
