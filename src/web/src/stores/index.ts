import { combineReducers, createStore } from "redux";
import { userReducer } from "./user/reducer";

const rootReducer = combineReducers({
    user: userReducer,
  })
export const store = createStore(
  rootReducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
