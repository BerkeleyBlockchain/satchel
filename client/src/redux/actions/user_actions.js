import Web3 from "web3";
import { push } from "connected-react-router";

import * as types from "../types";
import contractAbi from "../../abi/UnicefSatchel.json";
import { erc20Abi, cTokenAbi } from "../../abi/abis";
import userAbi from "../../abi/User.json";
import schoolAbi from "../../abi/School.json";

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

export const getName = (contractAddress) => async (dispatch) => {
  let userContract = new web3.eth.Contract(userAbi.abi, contractAddress);
  let name = await userContract.methods.getName().call();
  console.log("Name is ", name);
  dispatch({ type: types.GET_NAME, payload: name });
};

export const getBalance = (contractAddress) => async (dispatch) => {
  const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
  const cToken = new web3.eth.Contract(cTokenAbi, cTokenAddress);
  const userContract = new web3.eth.Contract(userAbi.abi, contractAddress);

  let cTokenBalance = await cToken.methods.balanceOf(contractAddress).call();
  cTokenBalance = cTokenBalance / 1e8;
  console.log(`MyContract's Token Balance:`, cTokenBalance);
  let balance =
    (await userContract.methods.getBalance(cTokenAddress).call()) / 1e18 / 1e18;
  console.log(balance);
  dispatch({ payload: Number(balance.toFixed(2)), type: types.GET_BALANCE });
};

export const handleUserLogout = (history) => {
  history.push({ pathname: "/Login " });
  return {
    type: types.LOGOUT_USER,
    payload: {},
  };
};
