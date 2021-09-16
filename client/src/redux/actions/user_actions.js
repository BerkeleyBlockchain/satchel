import Web3 from "web3";
import { push } from "connected-react-router";

import * as types from "../types";
import contractAbi from "../../abi/UnicefSatchel.json";

const web3 = new Web3(Web3.givenProvider);

export const handleUserLogin = (name, history) => async (dispatch) => {
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
        name,
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
