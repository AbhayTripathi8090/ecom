import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { signAuthToken } from "../../utils/jwt";
import type {
  AuthTokens,
  AuthUser,
  PublicUser,
  UserDocument,
} from "./auth.types";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "./auth.validation";
import { User } from "./user.model";

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const toAuthUser = (user: UserDocument): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
});

const createToken = (user: UserDocument): string =>
  signAuthToken({
    userId: user._id.toString(),
    role: user.role,
  });

export const registerUser = async (
  input: RegisterInput,
  profileImageFile?: Express.Multer.File,
): Promise<{ user: PublicUser; tokens: AuthTokens }> => {
  const existingUser = await User.exists({ email: input.email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const profileImage = profileImageFile
    ? await uploadImage(profileImageFile.buffer, `${env.CLOUDINARY_FOLDER}/users`)
    : undefined;

  const user = await User.create({
    ...input,
    profileImage,
  });
  const accessToken = createToken(user);

  return {
    user: toPublicUser(user),
    tokens: { accessToken },
  };
};

export const loginUser = async (
  input: LoginInput,
): Promise<{ user: PublicUser; tokens: AuthTokens }> => {
  const user = await User.findOne({ email: input.email, isActive: true }).select(
    "+password +isActive",
  );

  if (!user || !(await user.comparePassword(input.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = createToken(user);

  return {
    user: toPublicUser(user),
    tokens: { accessToken },
  };
};

export const getUserById = async (userId: string): Promise<AuthUser> => {
  const user = await User.findOne({ _id: userId, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toAuthUser(user);
};

export const changeUserPassword = async (
  userId: string,
  input: ChangePasswordInput,
): Promise<void> => {
  const user = await User.findOne({ _id: userId, isActive: true }).select(
    "+password +isActive",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!(await user.comparePassword(input.currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = input.newPassword;
  await user.save();
};

export const updateUserProfileImage = async (
  userId: string,
  file: Express.Multer.File,
): Promise<PublicUser> => {
  const user = await User.findOne({ _id: userId, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const previousPublicId = user.profileImage?.publicId;
  const profileImage = await uploadImage(
    file.buffer,
    `${env.CLOUDINARY_FOLDER}/users`,
  );

  user.profileImage = profileImage;
  await user.save({ validateBeforeSave: false });

  if (previousPublicId) {
    await deleteImage(previousPublicId);
  }

  return toPublicUser(user);
};
