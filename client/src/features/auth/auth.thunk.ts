import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./auth.service";
import { storage } from "../../lib/storage";
import { getErrorMessage } from "../../utils/helpers";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./auth.types";

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    if (data.token) {
      storage.setToken(data.token);
      storage.setUser(data.user);
    }
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.register(credentials);
    if (data.token) {
      storage.setToken(data.token);
      storage.setUser(data.user);
    }
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async () => {
  try {
    await authService.logout();
  } catch (error) {
    // Ignore backend logout error, still clear local storage
    console.warn("Logout error:", getErrorMessage(error));
  } finally {
    storage.clearAuth();
  }
});

export const getCurrentUserThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    storage.clearAuth();
    return rejectWithValue(getErrorMessage(error));
  }
});
