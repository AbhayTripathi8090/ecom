import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown =>
  value === "" ? undefined : value;

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid category id");

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).optional(),
  description: z.preprocess(emptyToUndefined, z.string().trim().max(1000).optional()),
  parentCategory: z.preprocess(emptyToUndefined, objectIdSchema.optional()),
  isActive: z.coerce.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: objectIdSchema,
});

export const categoryQuerySchema = z.object({
  search: z.string().trim().optional(),
  parentCategory: z.preprocess(emptyToUndefined, objectIdSchema.optional()),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z
    .enum(["name", "-name", "createdAt", "-createdAt", "updatedAt", "-updatedAt"])
    .default("-createdAt"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
