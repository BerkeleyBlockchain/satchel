import Web3 from "web3";

import * as types from "../types";
import contractAbi from "../../abi/UnicefSatchel.json";
import { erc20Abi, cTokenAbi, schoolJSON } from "../../abi/abis";
import userAbi from "../../abi/User.json";
import schoolAbi from "../../abi/School.json";
import axios from "axios";

const web3 = new Web3(Web3.givenProvider);

export const getSchoolByUser = (userAddress) => async (dispatch) => {
  const userContract = new web3.eth.Contract(userAbi.abi, userAddress);

  try {
    console.log("Setting School");
    let schoolAddress = await userContract.methods.schoolContract().call();
    console.log("School address is ", schoolAddress);
    console.log(schoolAddress);
    const schoolContract = new web3.eth.Contract(schoolAbi.abi, schoolAddress);
    const name = await schoolContract.methods.getName().call();
    console.log("School name is ", name);

    dispatch({
      type: types.GET_SCHOOL_INFO,
      payload: {
        name,
        address: schoolAddress,
      },
    });

    dispatch(getSchoolProjects(schoolAddress));
  } catch (e) {
    console.log(e);
  }
};

export const getSchoolProjects = (schoolAddress) => async (dispatch) => {
  let { data } = await axios.get(
    "http://localhost:4000/api/project?schoolAddress=" + schoolAddress
  );
  dispatch({
    type: types.GET_SCHOOL_PROJECTS,
    payload: data.projects,
  });
};

export const loginSchool = (schoolName, history) => async (dispatch) => {
  dispatch({ type: types.LOAD_LOGIN_SCHOOL });

  let contractInstance = new web3.eth.Contract(
    contractAbi.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  try {
    if (!window.ethereum) {
      console.log("Metamask not installed");
      return dispatch({
        type: types.SCHOOL_LOGIN_ERROR,
        payload: "Metamask not installed",
      });
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log(accounts);
    let ownedSchoolIds = await contractInstance.methods
      .getSchoolByOwner(account)
      .call();
    console.log(ownedSchoolIds);
    let ownedSchoolNames = await Promise.all(
      ownedSchoolIds.map(
        async (id) => await contractInstance.methods.getSchoolName(id).call()
      )
    );
    console.log(ownedSchoolNames);
    if (!ownedSchoolNames.includes(schoolName)) {
      console.log("No school found");
      return dispatch({
        type: types.SCHOOL_LOGIN_ERROR,
        payload: "No School Found",
      });
    }

    let id = ownedSchoolNames.indexOf(schoolName);
    let schoolAddress = await contractInstance.methods.schoolArray(id).call();
    console.log(schoolName);
    console.log(schoolAddress);
    dispatch({
      type: types.GET_SCHOOL_INFO,
      payload: {
        name: schoolName,
        address: schoolAddress,
      },
    });

    history.push({
      pathname: "/SchoolDashboard",
    });
  } catch (e) {
    console.log(e);
    return dispatch({
      type: types.SCHOOL_LOGIN_ERROR,
      payload: e.message,
    });
  }
};

export const deploySchool = (schoolName, history) => async (dispatch) => {
  let contractInstance = new web3.eth.Contract(
    contractAbi.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );
  dispatch({ type: types.LOAD_CREATE_SCHOOL });

  try {
    const accounts = await web3.eth.getAccounts();
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contractInstance.methods
      .newSchool(this.state.Name)
      .estimateGas({ from: accounts[0] });

    const { events } = await contractInstance.methods
      .newSchool(this.state.Name)
      .send({ from: accounts[0], gasPrice: gasPrice, gas: gasEstimate });
    const id = events.newSchoolEvent.returnValues.schoolId;
    console.log(this.state.Name + " created");
    console.log(id);
    const schoolAddress = await contractInstance.methods.schoolArray(id).call();
    console.log(schoolAddress); // Gives address of school contract

    await axios.post("http://localhost:4000/api/school/createSchool", {
      name: schoolName,
      address: schoolAddress,
    });

    dispatch({
      type: types.GET_SCHOOL_INFO,
      payload: {
        name: schoolName,
        address: schoolAddress,
      },
    });

    history.push({
      pathname: "/SchoolDashboard",
    });
  } catch (err) {
    console.log(err);
    return dispatch({
      type: types.SCHOOL_LOGIN_ERROR,
      payload: err.message,
    });
  }
};

export const handleSchoolLogout = (history) => {
  history.push({ pathname: "/Login" });
  return {
    type: types.LOGOUT_USER,
    payload: {},
  };
};

// All this needs to be changed
// Mainnet address of the underlying token contract. Example: Dai.
const underlyingMainnetAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const underlying = new web3.eth.Contract(erc20Abi, underlyingMainnetAddress);

// Mainnet contract address and ABI for the cToken, which can be found in the
// mainnet tab on this page: https://compound.finance/docs
const cTokenAddress = process.env.REACT_APP_CTOKEN_ADDRESS;
const cToken = new web3.eth.Contract(cTokenAbi, cTokenAddress);

export const getSchoolBalance = (schoolAddress) => async (dispatch) => {
  try {
    const schoolInstance = new web3.eth.Contract(schoolJSON.abi, schoolAddress);

    let schoolBalance = await schoolInstance.methods
      .getBalance(underlyingMainnetAddress)
      .call();
    console.log("schoolBalance: " + Number((schoolBalance / 1e18).toFixed(2)));
    dispatch({
      type: types.SET_SCHOOL_BALANCE,
      payload: Number((schoolBalance / 1e18).toFixed(6)),
    });
  } catch (err) {
    console.log("setBalance " + err.message);
  }
};

// This is probably broken...
const underlyingDecimals = 18;
export const withdrawSchool = (schoolAddress, withdraw) => async (dispatch) => {
  const amount = web3.utils.toHex(withdraw * Math.pow(10, underlyingDecimals));
  dispatch({ type: types.LOAD_SCHOOL_WITHDRAW });
  try {
    const accounts = await web3.eth.getAccounts();
    const schoolInstance = new web3.eth.Contract(schoolJSON.abi, schoolAddress);

    let schoolBalance = await schoolInstance.methods
      .getBalance(underlyingMainnetAddress)
      .call();
    console.log("school balance: " + schoolBalance / 1e18);
    console.log("withdrawing ... ");

    await schoolInstance.methods
      .withdrawBalance(schoolBalance, underlyingMainnetAddress)
      .send({
        from: accounts[0],
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(20000000000),
      });

    dispatch(getSchoolBalance(schoolAddress));
  } catch (err) {
    console.log(err.message);
  }
};
