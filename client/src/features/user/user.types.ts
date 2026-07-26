import type { User } from "../auth/auth.types";

export interface UserProfile extends User {
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  bio?: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: UserProfile["address"];
  bio?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}
