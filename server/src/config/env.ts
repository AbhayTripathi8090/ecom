import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  MONGODB_URI: z.string(),

  DB_NAME: z.string(),

  JWT_SECRET: z.string().min(10),

  JWT_EXPIRES_IN: z.string().default("7d"),

  JWT_COOKIE_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),

  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:5174"),

  CLOUDINARY_CLOUD_NAME: z.string(),

  CLOUDINARY_API_KEY: z.string(),

  CLOUDINARY_API_SECRET: z.string(),

  CLOUDINARY_FOLDER: z.string().default("ecom-assignment"),

  RAZORPAY_KEY_ID: z.string().default("rzp_test_MockRazorpayKeyId12345"),

  RAZORPAY_KEY_SECRET: z.string().default("MockRazorpayKeySecret1234567890"),
});

export const env = envSchema.parse(process.env);
