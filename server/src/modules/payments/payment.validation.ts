import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const paymentIdParamSchema = z.object({
  id: objectIdSchema,
});

export const orderPaymentParamSchema = z.object({
  orderId: objectIdSchema,
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "refunded"]),
  provider: z.string().trim().max(80).optional(),
  transactionId: z.string().trim().max(120).optional(),
  failureReason: z.string().trim().max(500).optional(),
});

export const paymentQuerySchema = z.object({
  status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(["createdAt", "-createdAt", "amount", "-amount"]).default("-createdAt"),
});

export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
