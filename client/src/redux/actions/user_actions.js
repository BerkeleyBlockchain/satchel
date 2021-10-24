import Web3 from "web3";

import * as types from "../types";
import contractAbi from "../../contracts/UnicefSatchel.sol/UnicefSatchel.json";
import erc20Abi from "../../contracts/User.sol/Erc20.json";
import cTokenAbi from "../../contracts/User.sol/CErc20.json";
import userAbi from "../../contracts/User.sol/User.json";
import schoolAbi from "../../contracts/School.sol/School.json";
import axios from "axios";
import assets from "../../assets.json";

const web3 = new Web3(Web3.givenProvider);

export const handleUserLogin = (history) => async (dispatch) => {
  let contractInstance = new web3.eth.Contract(
    contractAbi.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  console.log(process.env.REACT_APP_CONTRACT_ADDRESS);

  try {
    if (!window.ethereum) {
      console.log("Metamask not installed");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    let userContractAddress = await contractInstance.methods
      .getUserContract()
      .call({ from: accounts[0] });
    console.log("user addresss: " + userContractAddress);
    console.log("account[0]" + accounts[0]);

    dispatch({
      type: types.LOGIN_USER_SUCCESS,
      payload: {
        contractAddress: userContractAddress,
        address: accounts[0],
        name: "",
      },
    });

    if (userContractAddress == "0x0000000000000000000000000000000000000000") {
      console.log("New user detected");
      history.push({ pathname: "/SelectSchool" });
    } else {
      history.push({ pathname: "/Dashboard" });
    }
  } catch (err) {
    console.log(err);
    console.log(err.message);
    dispatch({ type: types.LOGIN_USER_FAILURE, payload: err.message });
  }
};

export const handleUserSignup = (school, name, history) => async (dispatch) => {
  let contractInstance = new web3.eth.Contract(
    contractAbi.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  console.log(process.env.REACT_APP_CONTRACT_ADDRESS);

  try {
    if (!window.ethereum) {
      console.log("Metamask not installed");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    let userContractAddress = await contractInstance.methods
      .getUserContract()
      .call({ from: accounts[0] });
    console.log("user addresss: " + userContractAddress);
    console.log("account[0]" + accounts[0]);

    if (userContractAddress == "0x0000000000000000000000000000000000000000") {
      await contractInstance.methods
        .createUserContract(name, school.address, true)
        .send({ from: accounts[0] });

      userContractAddress = await contractInstance.methods
        .getUserContract()
        .call({ from: accounts[0] });

      dispatch({
        type: types.LOGIN_USER_SUCCESS,
        payload: {
          contractAddress: userContractAddress,
          address: accounts[0],
          name,
        },
      });
      history.push({ pathname: "/Dashboard" });
    } else {
      console.log("Not a new user!");
      history.push({ pathname: "/Login" });
    }
  } catch (err) {
    console.log(err);
    console.log(err.message);
    dispatch({ type: types.LOGIN_USER_FAILURE, payload: err.message });
  }
};

export const getName = (contractAddress) => async (dispatch) => {
  let userContract = new web3.eth.Contract(userAbi.abi, contractAddress);
  let name = await userContract.methods.name().call();
  console.log("Name is ", name);
  dispatch({ type: types.GET_NAME, payload: name });
};

export const getBalance = (contractAddress) => async (dispatch) => {
  let userContract = new web3.eth.Contract(userAbi.abi, contractAddress);
  try {
    const promises = assets.map(async (asset) => {
      console.log(asset);
      return userContract.methods
        .underlyingAmountDeposited(asset.tokenAddress)
        .call();
    });
    console.log(promises);

    let data = await Promise.all(promises);
    console.log(data);
    const balance = {};

    for (let i = 0; i < assets.length; i++) {
      balance[assets[i].symbol] = Number((data[i] / 1e18).toFixed(2));
    }

    console.log("balancess");
    console.log(balance);
    dispatch({ type: types.GET_BALANCE, payload: balance });

    const prices = await axios.get(
      "http://localhost:4000/api/user/getTokenPrices",
      { params: { tokens: assets.map((asset) => asset.symbol).join() } }
    );

    console.log("price");
    console.log(prices.data.data);

    let tb = 0;
    assets.forEach((asset) => {
      let { symbol } = asset;
      tb += prices.data.data[symbol].quote.USD.price * balance[symbol];
    });

    dispatch({ type: types.GET_TOTAL_BALANCE, payload: Number(tb.toFixed(2)) });
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
};

export const getContribution = (contractAddress) => async (dispatch) => {
  const userContract = new web3.eth.Contract(userAbi.abi, contractAddress);
  let x = (await userContract.methods.getContribution().call()) / 1e18;
  dispatch({ type: types.GET_CONTRIBUTION, payload: x });
};

export const getInterestRate = (contractAddress) => async (dispatch) => {
  const { data } = await axios.get(
    "https://api.compound.finance/api/v2/ctoken",
    {
      params: {
        addresses: assets.map((asset) => asset.cTokenAddressMainnet),
      },
    }
  );

  const interestRates = data.cToken.map(
    (cToken) => cToken.supply_rate.value * 50
  );
  console.log("Interest rate...");
  console.log(interestRates);

  dispatch({
    type: types.GET_INTEREST_RATE,
    payload: Number(((data.cToken[0].supply_rate.value / 2) * 100).toFixed(2)),
  });
};

// I think this needs to be initialized for each asset we want to do...
const underlyingDecimals = 18;
const underlyingMainnetAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const underlying = new web3.eth.Contract(
  erc20Abi.abi,
  underlyingMainnetAddress
);

const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
const cToken = new web3.eth.Contract(cTokenAbi.abi, cTokenAddress);

export const deposit = (contractAddress, amount) => async (dispatch) => {
  console.log(process.env.REACT_APP_CTOKEN_ADDRESS);
  console.log("handleGet\n");
  dispatch({ type: types.LOAD_DEPOSIT });

  try {
    const accounts = await web3.eth.getAccounts();
    const userContract = new web3.eth.Contract(userAbi.abi, contractAddress);

    const underlyingMainnetAddress = process.env.REACT_APP_TOKEN_ADDRESS;
    const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
    const underlying = new web3.eth.Contract(
      erc20Abi.abi,
      underlyingMainnetAddress
    );
    const underlyingDecimals = 18;

    console.log("Approve funds");
    let supply = web3.utils.toHex(amount * Math.pow(10, underlyingDecimals));
    await underlying.methods.approve(contractAddress, supply).send({
      from: accounts[0],
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(20000000000),
    });

    await userContract.methods
      .deposit(underlyingMainnetAddress, cTokenAddress, supply)
      .send({
        from: accounts[0],
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(20000000000),
      });
    console.log("supply result");

    dispatch(getBalance(contractAddress));
  } catch (e) {
    console.log(e);
  }
};

export const withdraw =
  (contractAddress, withdrawAmount) => async (dispatch) => {
    try {
      dispatch({ type: types.LOAD_WITHDRAW });
      const amount = web3.utils.toHex(
        withdrawAmount * Math.pow(10, underlyingDecimals)
      );

      const accounts = await web3.eth.getAccounts();
      const userContract = new web3.eth.Contract(userAbi.abi, contractAddress);

      console.log(`Redeeming ...`);
      let redeemResult = await userContract.methods
        .withdraw(amount, underlyingMainnetAddress, cTokenAddress)
        .send({
          from: accounts[0],
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(20000000000),
        });

      console.log(redeemResult.events.MyLog);
      dispatch(getBalance(contractAddress));
    } catch (e) {
      console.log(e);
    }
  };

export const handleUserLogout = (history) => {
  history.push({ pathname: "/Login" });
  return {
    type: types.LOGOUT_USER,
    payload: {},
  };
};
