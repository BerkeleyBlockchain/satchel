import * as types from "../types";

const INITIAL_STATE = {
  name: "",
  address: "",
  projects: [],
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
    default:
      return state;
  }
}
