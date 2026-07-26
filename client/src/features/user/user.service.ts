import { api } from "../../lib/api";
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "./user.types";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res: any = await api.get("/users/me");
    const data = res.data || res;
    return data.user || data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    let payload: any = dto;

    if (dto.profileImage) {
      const formData = new FormData();
      if (dto.name) formData.append("name", dto.name);
      if (dto.email) formData.append("email", dto.email);
      if (dto.phone) formData.append("phone", dto.phone);
      formData.append("profileImage", dto.profileImage);
      payload = formData;
    }

    const res: any = await api.patch("/users/me", payload);
    const data = res.data || res;
    return data.user || data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.patch("/users/change-password", data);
  },
};
