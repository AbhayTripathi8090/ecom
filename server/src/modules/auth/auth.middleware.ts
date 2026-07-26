import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { verifyAuthToken } from "../../utils/jwt";
import { getUserById } from "./auth.service";
import type { UserRole } from "./auth.types";

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1] ?? null;
};

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token =
      getBearerToken(req.headers.authorization) ?? req.cookies?.accessToken;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyAuthToken(token);
    req.user = await getUserById(decoded.userId);

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("You do not have permission to access this resource", 403));
      return;
    }

    next();
  };
