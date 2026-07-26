import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/user/user.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
