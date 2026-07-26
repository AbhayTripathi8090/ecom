import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const addressSchema = z.object({
  label: z.string().trim().max(50).optional(),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  addressLine1: z.string().trim().min(5).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(100),
  isDefault: z.coerce.boolean().optional(),
});

export const updateAddressSchema = addressSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one address field is required" },
);

export const addressIdParamSchema = z.object({
  id: objectIdSchema,
});

export const shippingOrderParamSchema = z.object({
  orderId: objectIdSchema,
});

export const updateShippingStatusSchema = z.object({
  orderStatus: z.enum(["processing", "shipped", "delivered"]),
  trackingNumber: z.string().trim().max(100).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type UpdateShippingStatusInput = z.infer<typeof updateShippingStatusSchema>;
