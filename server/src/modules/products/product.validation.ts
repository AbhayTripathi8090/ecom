import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown =>
  value === "" ? undefined : value;

const csvToArray = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
};

const parseJsonObject = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
};

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid id");

const seoSchema = z.preprocess(
  parseJsonObject,
  z
    .object({
      title: z.preprocess(emptyToUndefined, z.string().trim().max(70).optional()),
      description: z.preprocess(
        emptyToUndefined,
        z.string().trim().max(160).optional(),
      ),
      keywords: z.preprocess(
        csvToArray,
        z.array(z.string().trim().min(1)).optional(),
      ),
    })
    .optional(),
);

const productBaseSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    slug: z.string().trim().min(2).max(180).optional(),
    description: z.string().trim().min(10).max(5000),
    category: objectIdSchema,
    brand: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
    price: z.coerce.number().min(0),
    discountPrice: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).optional(),
    ),
    stock: z.coerce.number().int().min(0).default(0),
    sku: z.string().trim().min(2).max(80),
    isFeatured: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
    seo: seoSchema,
  })
  .strict()
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.price === undefined ||
      data.discountPrice <= data.price,
    {
      message: "Discount price cannot be greater than price",
      path: ["discountPrice"],
    },
  );

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.partial();

export const productIdParamSchema = z.object({
  id: objectIdSchema,
});

export const productQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.preprocess(emptyToUndefined, objectIdSchema.optional()),
  brand: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z
    .enum([
      "name",
      "-name",
      "price",
      "-price",
      "createdAt",
      "-createdAt",
      "ratings.average",
      "-ratings.average",
    ])
    .default("-createdAt"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
