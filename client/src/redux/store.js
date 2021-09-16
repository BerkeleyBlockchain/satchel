import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const initialState = {
  user: {
    address: "",
  },
};

export default createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);
