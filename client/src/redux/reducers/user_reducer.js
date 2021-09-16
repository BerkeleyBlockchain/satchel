import * as types from "../types";

const INITIAL_STATE = {
  address: "",
  name: "",
  contractAddress: "",
  balance: 0,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return { ...INITIAL_STATE, ...action.payload };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    case types.GET_NAME:
      return { ...state, name: action.payload };
    case types.GET_BALANCE: {
      return { ...state, balance: action.payload };
    }
    default:
      return state;
  }
}
