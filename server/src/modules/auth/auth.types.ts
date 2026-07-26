import type { Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: UserProfileImage;
}

export interface UserProfileImage {
  url: string;
  publicId: string;
}

export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: UserProfileImage;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type PublicUser = Omit<AuthUser, "id"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface AuthTokens {
  accessToken: string;
}
