import hre, { ethers } from "hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signers } from "./types";
import { School } from "../contract_types/School";
import { UnicefSatchel } from '../contract_types/UnicefSatchel';
import { TestDai } from '../contract_types/TestDai';
import { TestCDai } from '../contract_types/TestCDai';
import { User } from '../contract_types/User';
import { getOverrideOptions } from "./utils";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { deployContract } = hre.waffle;

describe("Unit tests", function () {
    let unicefSatchel: UnicefSatchel;
    let testDai: TestDai;
    let testCDai: TestCDai;
    let admin: SignerWithAddress;
    let owner: SignerWithAddress;
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let multiplier: number;
    const schoolName = "School Name";
    const schoolName2 = "Second School Name";
    const erc20Address = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
    const userName = "User Name";
    beforeEach(async function () {
      this.signers = {} as Signers;
      const signers: SignerWithAddress[] = await hre.ethers.getSigners();
      admin = signers[0];
      owner = signers[1];
      deployer = signers[2];
      alice = signers[3];
      bob = signers[4];
  
      // deploy UnicefSatchel Contract
      const UnicefSatchelArtifact: Artifact = await hre.artifacts.readArtifact("UnicefSatchel");
      unicefSatchel = <UnicefSatchel><any>(
        await deployContract(owner, UnicefSatchelArtifact, [], {gasPrice: 1_000_000_00})
      );

      // deploy testDai contract
      const TestDaiArtifact: Artifact = await hre.artifacts.readArtifact("testDai");
      testDai = <TestDai><any> (
        await deployContract(owner, TestDaiArtifact, [], {gasPrice: 1_000_000_00})
      );

      // deploy testCDai
      const TestCDaiArtifact: Artifact = await hre.artifacts.readArtifact("testCDai");
      testCDai = <TestCDai><any> (
        await deployContract(owner, TestCDaiArtifact, [testDai.address], {gasPrice: 1_000_000_00})
      );

      multiplier = 10**18;

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

      it("Users should be able to retrieve information about schools", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });
        let eventFilter = unicefSatchel.filters.newSchoolEvent();
        let events = await unicefSatchel.queryFilter(eventFilter, "latest");
        expect(events[0].args.schoolName).to.equal(schoolName);
        expect(events[0].args.schoolId).to.eq(0);
  
        let name = await unicefSatchel.getSchoolName(0);
        expect(name).to.equal(schoolName);
      });

      it("Users should be able to get all schools owned", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });
  
        await unicefSatchel.newSchool(schoolName2, {
          from: owner.address,
        });
  
        let ownerOwned = await unicefSatchel.getSchoolByOwner(owner.address);
        expect(ownerOwned[0]).to.eq(0);
        expect(ownerOwned[1]).to.eq(1);
        expect(ownerOwned.length).to.equal(2);
      });

      it("Schools should be able to check balance", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });
  
        let balance = await unicefSatchel.getSchoolBalance(0, erc20Address);
        expect(balance).to.eq(0);
      });
    });


    describe("Users", () => {
      it("Users should be able to create users", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });

        const schoolAddress = await unicefSatchel.schoolArray(0);

        await unicefSatchel.createUserContract(userName, schoolAddress, true, {
          from: owner.address,
        });

        const userAddress = await unicefSatchel.getUserContract({
          from: owner.address,
        });
        let userInstance = await ethers.getContractAt("User", userAddress);

        let name = await userInstance.name();
        expect(name).to.equal(userName);

        let address = await userInstance.schoolContract();
        expect(address).to.equal(schoolAddress);
      });

      it("Users should be able to get their balance", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });

        const schoolAddress = await unicefSatchel.schoolArray(0);

        await unicefSatchel.createUserContract(userName, schoolAddress, true, {
          from: owner.address,
        });

        const userAddress = await unicefSatchel.getUserContract({
          from: owner.address,
        });
        let userInstance = await ethers.getContractAt("User", userAddress);
        let balance = await userInstance.getBalance(erc20Address);
      });
    });

    describe("Interest functionality", () => {
      it("Tests that interest is split between user and school 50-50", async () => {
        await unicefSatchel.newSchool(schoolName, {
          from: owner.address,
        });

        const schoolAddress = await unicefSatchel.schoolArray(0);

        await unicefSatchel.connect(alice).createUserContract(userName, schoolAddress, true, {
          from: alice.address,
        });

        const _userAddress = await unicefSatchel.connect(alice).getUserContract({
          from: alice.address,
        });
        let userInstance: User = <User> (await ethers.getContractAt("User", _userAddress));

        // let's give alice some Dai
        // let aliceInitialDai = BigInt(5 * 100);
        let aliceInitialDai = 500;
        await testDai.setBalance(alice.address, aliceInitialDai);
        await testDai.connect(alice).approve(userInstance.address, aliceInitialDai);

        // // Now let's deposit this 
        userInstance.connect(alice).deposit(testDai.address, testCDai.address, aliceInitialDai);


      });

    });
});
