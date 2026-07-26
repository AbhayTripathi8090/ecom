import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "./user.service";
import { getErrorMessage } from "../../utils/helpers";
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "./user.types";

export const fetchUserProfileThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    return await userService.getProfile();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserProfileThunk = createAsyncThunk<
  UserProfile,
  UpdateProfileDto,
  { rejectValue: string }
>("user/updateProfile", async (updateData, { rejectWithValue }) => {
  try {
    return await userService.updateProfile(updateData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const changePasswordThunk = createAsyncThunk<
  void,
  ChangePasswordDto,
  { rejectValue: string }
>("user/changePassword", async (passwordData, { rejectWithValue }) => {
  try {
    await userService.changePassword(passwordData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
