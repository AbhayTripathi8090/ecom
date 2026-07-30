import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { AppError } from "../utils/AppError";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError("Only JPG, PNG, and WEBP images are allowed", 400));
      return;
    }

    cb(null, true);
  },
});
