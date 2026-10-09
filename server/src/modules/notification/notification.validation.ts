import { z } from "zod";

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isRead: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value === "true";
    }),
});

export const notificationIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid notification ID"),
});

export const notificationParamsSchema =
  notificationIdSchema;