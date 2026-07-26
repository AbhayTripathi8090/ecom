import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/user/user.slice";
import categoryReducer from "../features/category/category.slice";
import productReducer from "../features/product/product.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  category: categoryReducer,
  product: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
