import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_AUTH_STATE } from "./auth.constants";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getCurrentUserThunk,
  uploadProfileImageThunk,
} from "./auth.thunk";
import { storage } from "../../lib/storage";
import type { User } from "./auth.types";

const tokenFromStorage = storage.getToken();
const userFromStorage = storage.getUser();

const initialState = {
  ...INITIAL_AUTH_STATE,
  token: tokenFromStorage,
  user: userFromStorage,
  isAuthenticated: !!tokenFromStorage,
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
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.setUser(action.payload);
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
      state.error = action.payload || "Login failed";
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token || action.payload.tokens?.accessToken || state.token;
      state.error = null;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Registration failed";
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
      state.isAuthenticated = true;
    });
    builder.addCase(getCurrentUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });

    // Upload Profile Image
    builder.addCase(uploadProfileImageThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadProfileImageThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(uploadProfileImageThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to upload image";
    });
  },
});

export const { clearError, setAuth, updateUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
