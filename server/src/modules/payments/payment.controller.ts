import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createRazorpayOrderService,
  getPaymentById,
  getPaymentByOrder,
  getPayments,
  updatePaymentStatus,
  verifyRazorpayPaymentService,
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

export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const result = await createRazorpayOrderService(orderId, req.user!.id);

  res.status(200).json({ success: true, data: result });
});

export const verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const result = await verifyRazorpayPaymentService(
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  );

  res.status(200).json({ success: true, data: result });
});
