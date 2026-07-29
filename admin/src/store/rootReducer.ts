import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/user/user.slice";
import categoryReducer from "../features/category/category.slice";
import productReducer from "../features/product/product.slice";
import orderReducer from "../features/order/order.slice";
import paymentReducer from "../features/payment/payment.slice";
import shippingReducer from "../features/shipping/shipping.slice";
import dashboardReducer from "../features/dashboard/dashboard.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  category: categoryReducer,
  product: productReducer,
  order: orderReducer,
  payment: paymentReducer,
  shipping: shippingReducer,
  dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
