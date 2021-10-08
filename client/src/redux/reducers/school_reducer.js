import * as types from "../types";

const INITIAL_STATE = {
  name: "",
  address: "",
  projects: [],
  balance: 0,
  loginLoading: false,
  deployLoading: false,
  withdrawLoading: false,
  error: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_SCHOOL_INFO: {
      return {
        ...state,
        name: action.payload.name,
        address: action.payload.address,
      };
    }
    case types.GET_SCHOOL_PROJECTS: {
      return { ...state, projects: action.payload };
    }
    case types.SET_SCHOOL_BALANCE: {
      return { ...state, balance: action.payload, withdrawLoading: false };
    }
    case types.LOAD_CREATE_SCHOOL: {
      return { ...state, deployLoading: true };
    }
    case types.LOAD_LOGIN_SCHOOL: {
      return { ...state, loginLoading: true };
    }
    case types.LOAD_SCHOOL_WITHDRAW: {
      return { ...state, withdrawLoading: true };
    }
    case types.SCHOOL_LOGIN_ERROR: {
      return {
        ...state,
        loginLoading: false,
        deployLoading: false,
        error: action.payload,
      };
    }
    case types.LOGOUT_USER: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}
