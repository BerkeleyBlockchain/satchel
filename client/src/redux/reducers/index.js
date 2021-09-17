import { combineReducers } from "redux";
import user from "./user_reducer";
import school from "./school_reducer";
export default combineReducers({
  user,
  school,
});
