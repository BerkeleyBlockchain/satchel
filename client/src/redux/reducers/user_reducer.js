import * as types from "../types";

const INITIAL_STATE = {
  address: "",
  name: "",
  contractAddress: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
