import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_AUTH_STATE } from "./auth.constants";
import { loginThunk, logoutThunk, getCurrentUserThunk } from "./auth.thunk";
import { storage } from "../../lib/storage";
import type { User } from "./auth.types";

const tokenFromStorage = storage.getToken();
const userFromStorage = storage.getUser();

const initialState = {
  ...INITIAL_AUTH_STATE,
  token: tokenFromStorage,
  user: userFromStorage,
  isAuthenticated: !!tokenFromStorage && userFromStorage?.role === "admin",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.user.role === "admin";
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token || action.payload.tokens?.accessToken || state.token;
      state.error = null;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload || "Admin login failed";
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });

    // Get Current User
    builder.addCase(getCurrentUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCurrentUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = action.payload.role === "admin";
    });
    builder.addCase(getCurrentUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, setAuth, resetAuth } = authSlice.actions;
export default authSlice.reducer;
