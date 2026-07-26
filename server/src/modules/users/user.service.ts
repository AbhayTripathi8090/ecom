import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import type { PublicUser, UserDocument } from "../auth/auth.types";
import { User } from "../auth/user.model";
import type { ChangePasswordInput, UpdateMeInput } from "./user.validation";

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getCurrentUser = async (userId: string): Promise<PublicUser> => {
  const user = await User.findOne({ _id: userId, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toPublicUser(user);
};

export const updateCurrentUser = async (
  userId: string,
  input: UpdateMeInput,
  profileImageFile?: Express.Multer.File,
): Promise<PublicUser> => {
  if (!input.name && !input.email && !profileImageFile) {
    throw new AppError("At least one profile field or image is required", 400);
  }

  const user = await User.findOne({ _id: userId, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (input.email && input.email !== user.email) {
    const emailTaken = await User.exists({
      _id: { $ne: user._id },
      email: input.email,
    });

    if (emailTaken) {
      throw new AppError("Email is already in use", 409);
    }
  }

  const previousPublicId = user.profileImage?.publicId;

  if (input.name) {
    user.name = input.name;
  }

  if (input.email) {
    user.email = input.email;
  }

  if (profileImageFile) {
    user.profileImage = await uploadImage(
      profileImageFile.buffer,
      `${env.CLOUDINARY_FOLDER}/users`,
    );
  }

  await user.save();

  if (profileImageFile && previousPublicId) {
    await deleteImage(previousPublicId);
  }

  return toPublicUser(user);
};

export const changeCurrentUserPassword = async (
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

export const deleteCurrentUser = async (userId: string): Promise<void> => {
  const user = await User.findOne({ _id: userId, isActive: true }).select(
    "+isActive",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const previousPublicId = user.profileImage?.publicId;

  user.isActive = false;
  user.profileImage = undefined;
  await user.save({ validateBeforeSave: false });

  if (previousPublicId) {
    await deleteImage(previousPublicId);
  }
};

export const getUserForAdmin = async (userId: string): Promise<PublicUser> => {
  const user = await User.findOne({ _id: userId, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toPublicUser(user);
};
