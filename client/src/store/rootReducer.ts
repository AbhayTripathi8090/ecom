import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/user/user.slice";
import categoryReducer from "../features/category/category.slice";
import productReducer from "../features/product/product.slice";
import cartReducer from "../features/cart/cart.slice";
import orderReducer from "../features/order/order.slice";
import paymentReducer from "../features/payment/payment.slice";
import shippingReducer from "../features/shipping/shipping.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  payment: paymentReducer,
  shipping: shippingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
