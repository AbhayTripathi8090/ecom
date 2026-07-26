import { AppError } from "../../utils/AppError";
import { getPagination, type PaginationMeta } from "../../utils/pagination";
import { User } from "../auth/user.model";
import type { AdminUserQueryInput } from "./admin.validation";

export const getUsersForAdmin = async (
  query: AdminUserQueryInput,
): Promise<{ users: unknown[]; meta: PaginationMeta }> => {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("+isActive")
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    meta: getPagination(query.page, query.limit, total),
  };
};

export const updateUserRole = async (
  userId: string,
  role: "user" | "admin",
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true },
  ).select("+isActive");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true },
  ).select("+isActive");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
