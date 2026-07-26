import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./user.types";
import { fetchUserProfileThunk, updateUserProfileThunk, changePasswordThunk } from "./user.thunk";

const initialState: UserState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchUserProfileThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchUserProfileThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load profile";
    });

    // Update Profile
    builder.addCase(updateUserProfileThunk.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(updateUserProfileThunk.fulfilled, (state, action) => {
      state.isUpdating = false;
      state.profile = action.payload;
    });
    builder.addCase(updateUserProfileThunk.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || "Failed to update profile";
    });

    // Change Password
    builder.addCase(changePasswordThunk.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(changePasswordThunk.fulfilled, (state) => {
      state.isUpdating = false;
    });
    builder.addCase(changePasswordThunk.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || "Failed to change password";
    });
  },
});

export const { clearUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
