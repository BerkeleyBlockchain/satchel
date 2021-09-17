import Web3 from "web3";

import * as types from "../types";
import contractAbi from "../../abi/UnicefSatchel.json";
import { erc20Abi, cTokenAbi } from "../../abi/abis";
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

    let { data } = await axios.get(
      "http://localhost:4000/api/project?schoolAddress=" + schoolAddress
    );
    console.log(data.projects);
    dispatch({
      type: types.GET_SCHOOL_PROJECTS,
      payload: data.projects,
    });
  } catch (e) {
    console.log(e);
  }
};
