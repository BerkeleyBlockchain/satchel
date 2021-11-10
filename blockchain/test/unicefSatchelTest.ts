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
import {Erc20} from '../contract_types/Erc20';
import {CErc20} from '../contract_types/cErc20';
import {Comptroller} from '../contract_types/Comptroller';
import { User } from '../contract_types/User';
import { getOverrideOptions } from "./utils";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
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
    let exchangeRate: number;
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
      // 5 cDai = 1 DAI
      exchangeRate = 5;

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
      it("User should be able to deposit into the User Contract and User Contract should get cDai", async () => {
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
        // let aliceInitialDai = BigInt(500 * multiplier);
        let aliceInitialDai = 500;
        await testDai.setBalance(alice.address, aliceInitialDai);
        await testDai.connect(alice).approve(userInstance.address, aliceInitialDai);
        let aliceDaiBalance = await testDai.balanceOf(alice.address);
        expect(aliceDaiBalance).to.be.eq(aliceInitialDai);

        // // Now let's deposit this 
        userInstance.connect(alice).deposit(testDai.address, testCDai.address, aliceInitialDai);
        let userContractDaiBalance = await testDai.balanceOf(userInstance.address);
        expect(userContractDaiBalance).to.be.eq(0);

        let userContractCDaiBalance = await testCDai.balanceOf(userInstance.address);
        expect(userContractCDaiBalance).to.be.eq(exchangeRate * aliceInitialDai);

      });

      it("User should be able to withdraw and interest should get split 50-50 with School", async () => {
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
        let aliceDaiBalance = await testDai.balanceOf(alice.address);

        // // Now let's deposit this 
        await userInstance.connect(alice).deposit(testDai.address, testCDai.address, aliceInitialDai);

        // let's pretend time elapsed and the deposited cDai are now worth 20% more dai
        await testDai.setBalance(testCDai.address, aliceInitialDai * 1.2);
        await testCDai.setBalance(userInstance.address, aliceInitialDai * exchangeRate * 1.2);
        let testCDaiContractDaiBalance = await testDai.balanceOf(testCDai.address);
        // Should be 600 
        expect(testCDaiContractDaiBalance).to.be.eq(aliceInitialDai * 1.2);

        let userContractCDaiBalance = await testCDai.balanceOf(userInstance.address);
        // Should be 5 * 500 * 1.2 = 3000 
        expect(userContractCDaiBalance).to.be.eq(aliceInitialDai * exchangeRate * 1.2);

        // Now let's withdraw
        userInstance.connect(alice).withdraw(aliceInitialDai * 1.2, testDai.address, testCDai.address);
        // Alice should've gotten 50% of the interest generated + her principal
        aliceDaiBalance = await testDai.balanceOf(alice.address);
        expect(aliceDaiBalance).to.be.eq(aliceInitialDai * 1.1);

        // School should've gotten 50% of the interest generated
        let schoolDaiBalance = await testDai.balanceOf(schoolAddress);
        expect(schoolDaiBalance).to.be.eq(aliceInitialDai * 0.1);

      });

    });

    describe("Borrowing functionality", () => {
      it("Should allow users to borrow using deposited collateral", async () => {
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

        // Ok, now let's simulate an actual interaction. 

        // 0. Some setup
        const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f";
        const daiContract: Erc20 = <Erc20> await ethers.getContractAt("contracts/User.sol:Erc20", daiAddr);
        const cDaiAddr = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";
        const cDaiContract: CErc20 = <CErc20> await ethers.getContractAt("contracts/User.sol:CErc20", cDaiAddr);
        const comptrollerAddr = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";
        const comptrollerContract: Comptroller = <Comptroller> await ethers.getContractAt("Comptroller", comptrollerAddr);

        //1. Let's transfer Dai from a whale to Alice
        const addrOfDaiWhale = "0x64f65e10f1c3cd7e920a6b34b83daf2f100f15e6";
        const daiWhaleUser = await ethers.getSigner(addrOfDaiWhale);

        // 2. Let's mint some cDai

        // 3. Let's enter the market for cDai (we can use it as collateral)

        // 4. Let's try to borrow some cUsdc

        // 5. Let's pay off our cUsdc loan 

        // 6. Let's try to redeem our cDai back for Dai? 

      });

    });
});
