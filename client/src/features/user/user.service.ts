import { api } from "../../lib/api";
import { USER_ENDPOINTS } from "./user.endpoints";
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "./user.types";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>(USER_ENDPOINTS.PROFILE);
    return res.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<UserProfile> => {
    const res = await api.put<UserProfile>(USER_ENDPOINTS.UPDATE_PROFILE, data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.post(USER_ENDPOINTS.CHANGE_PASSWORD, data);
  },
};
