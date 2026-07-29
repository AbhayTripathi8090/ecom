import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const adminUserParamSchema = z.object({
  id: objectIdSchema,
});

export const adminUserQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: z.enum(["customer", "admin"]).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(["createdAt", "-createdAt", "name", "-name"]).default("-createdAt"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});

export const updateUserStatusSchema = z.object({
  isActive: z.coerce.boolean(),
});

export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>;
