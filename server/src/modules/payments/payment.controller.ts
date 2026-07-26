import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getPaymentById,
  getPaymentByOrder,
  getPayments,
  updatePaymentStatus,
} from "./payment.service";
import { paymentQuerySchema } from "./payment.validation";

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getPayments(paymentQuerySchema.parse(req.query));

  res.status(200).json({ success: true, data: result });
});

export const findById = asyncHandler(async (req: Request, res: Response) => {
  const payment = await getPaymentById(String(req.params.id), req.user!);

  res.status(200).json({ success: true, data: { payment } });
});

export const findByOrder = asyncHandler(async (req: Request, res: Response) => {
  const payment = await getPaymentByOrder(String(req.params.orderId), req.user!);

  res.status(200).json({ success: true, data: { payment } });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const payment = await updatePaymentStatus(String(req.params.id), req.body);

  res.status(200).json({ success: true, data: { payment } });
});
