import type { RootState } from "../../store";

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserUpdating = (state: RootState) => state.user.isUpdating;
export const selectUserError = (state: RootState) => state.user.error;
