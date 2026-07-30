import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid product id");

export const wishlistProductSchema = z.object({
  productId: objectIdSchema,
});

export const wishlistProductParamSchema = z.object({
  productId: objectIdSchema,
});

export type WishlistProductInput = z.infer<typeof wishlistProductSchema>;
