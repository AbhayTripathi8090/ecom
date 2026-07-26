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
    const token = data.token || data.tokens?.accessToken;
    if (token) {
      storage.setToken(token);
    }
    if (data.user) {
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
    const token = data.token || data.tokens?.accessToken;
    if (token) {
      storage.setToken(token);
    }
    if (data.user) {
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
    const user = await authService.getCurrentUser();
    storage.setUser(user);
    return user;
  } catch (error) {
    storage.clearAuth();
    return rejectWithValue(getErrorMessage(error));
  }
});

export const uploadProfileImageThunk = createAsyncThunk<
  User,
  File,
  { rejectValue: string }
>("auth/uploadProfileImage", async (file, { rejectWithValue }) => {
  try {
    const user = await authService.uploadProfileImage(file);
    storage.setUser(user);
    return user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
