const User = artifacts.require("User");
const MockERC20 = artifacts.require("MockERC20");
const MockCERC20 = artifacts.require("MockCERC20");
// const MockSchool = artifacts.require("MockSchool");
const expect = require("chai").expect;

contract("User", async (accounts) => {
  let contract;
  let mockERC20 = await MockERC20.deployed();
  let mockCERC20 = await MockCERC20.deployed();
  // let mockSchool = await mockSchool.deployed();
  let schoolAddress = "0x0000000000000000000000000000000000000001"; //mockSchool.address;
  let contractName = "Contract Name";
  let depositAmount = 0x01;
  let withdrawAmount = 0xff;
  let depositMore = 0xff;

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

      const balance = await contract.cTokenBalance();
      expect(balance.toNumber()).to.be.equal(1);

      expect(amount.toNumber()).to.be.equal(0);
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

      const rate = await contract.interestRate.call(mockCERC20.address);

      expect(rate.toNumber()).to.be.equal(0);
    });
  });

  describe("withdrawFail", () => {
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

  describe("withdraw", () => {
    it("successful withdraw", async () => {
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCERC20.address,
        depositAmount
      );

      const depositTx = await contract.deposit(
        mockERC20.address,
        mockCERC20.address,
        depositAmount
      );

      const success = await contract.withdraw.call(
        depositAmount,
        mockCERC20.address
      );

      const tx = await contract.withdraw(depositAmount, mockCERC20.address);

      expect(success).to.be.equal(true);
    });
  });

  describe("doubleInterestRate", () => {
    it("gets the interest rate when changed", async () => {
      let mockCToken = await MockCERC20.deployed();

      const x = await mockCToken.setBalance(2 * depositAmount);
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCToken.address,
        depositAmount
      );

      const tx = await contract.deposit(
        mockERC20.address,
        mockCToken.address,
        depositAmount
      );

      const rate = await contract.interestRate.call(mockCToken.address);

      expect(rate.toNumber()).to.be.equal(100);
    });

    
  });

  describe("deposit", () => {
    it("makes a deposit", async () => {
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCERC20.address,
        0
      );

      const tx = await contract.deposit(
        mockERC20.address,
        mockCERC20.address,
        0
      );

      expect(amount.toNumber()).to.be.equal(0);
      expect(typeof tx).to.be.equal("object");
    });
  });

  describe("withdrawMore", () => {
    it("end to end withdraw", async () => {
      let mockCToken = await MockCERC20.deployed();

      const x = await mockCToken.setBalance(2 * 100);
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCToken.address,
        100
      );

      const depositTx = await contract.deposit(
        mockERC20.address,
        mockCToken.address,
        100
      );

      const curBalance = await contract.getBalance.call(mockCToken.address);
      expect(curBalance.toNumber()).to.be.equal(150);

      const success = await contract.withdraw.call(
        150,
        mockCERC20.address
      );

      const tx = await contract.withdraw(150, mockCERC20.address);

      expect(success).to.be.equal(true);
    });

  });

  describe("withdrawOdd", () => {
    it("deposit and withdraw odd amounts", async () => {
      let mockCToken = await MockCERC20.deployed();
      let amt = 101;

      const x = await mockCToken.setBalance(2 * amt + 1);
      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCToken.address,
        amt
      );

      const depositTx = await contract.deposit(
        mockERC20.address,
        mockCToken.address,
        amt
      );

      const curBalance = await contract.getBalance.call(mockCToken.address);
      // expect(curBalance.toNumber()).to.be.equal(150);

      const success = await contract.withdraw.call(
        curBalance,
        mockCERC20.address
      );

      const tx = await contract.withdraw(150, mockCERC20.address);

      expect(success).to.be.equal(true);
    });

  });

  describe("withdrawExchange", () => {
    it("end to end withdraw with double exchange rate", async () => {
      let mockCToken = await MockCERC20.deployed();

      const x = await mockCToken.setBalance(2 * 100);
      const y = await mockCToken.setExchangeRate(2);

      const amount = await contract.deposit.call(
        mockERC20.address,
        mockCToken.address,
        100
      );

      const depositTx = await contract.deposit(
        mockERC20.address,
        mockCToken.address,
        100
      );

      const rate = await contract.interestRate.call(mockCToken.address);
      expect(rate.toNumber()).to.be.equal(100);

      let curBalance = await contract.getBalance.call(mockCToken.address);
      expect(curBalance.toNumber()).to.be.equal(150);

      const success = await contract.withdraw.call(
        150,
        mockCERC20.address
      );

      const tx = await contract.withdraw(150, mockCERC20.address);
      expect(success).to.be.equal(true);

      curBalance = await contract.getBalance.call(mockCToken.address);
      expect(curBalance.toNumber()).to.be.equal(0);
    });

  });
  

  //deposit 0
  //deposit 0xff
  //change balanceOfUnderlying to 2x deposit amount (interest rate/withdraw)
  //Successful withdaw

});
