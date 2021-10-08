import * as types from "../types";

const INITIAL_STATE = {
  address: "",
  name: "",
  contractAddress: "",
  balance: 0,
  contribution: 0,
  interestRate: 0,
  depositLoading: false,
  withdrawLoading: false,
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
      return {
        ...state,
        balance: action.payload,
        depositLoading: false,
        withdrawLoading: false,
      };
    }
    case types.GET_CONTRIBUTION: {
      return { ...state, contribution: action.payload };
    }
    case types.GET_INTEREST_RATE:
      return { ...state, interestRate: action.payload };
    case types.LOAD_DEPOSIT:
      return { ...state, depositLoading: true };
    case types.LOAD_WITHDRAW:
      return { ...state, withdrawLoading: true };

    default:
      return state;
  }
}
