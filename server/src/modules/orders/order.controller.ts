import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  cancelMyOrder,
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "./order.service";
import { orderQuerySchema } from "./order.validation";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const order = await createOrderFromCart(req.user!.id, req.body);

  res.status(201).json({ success: true, data: { order } });
});

export const findMine = asyncHandler(async (req: Request, res: Response) => {
  const result = await getMyOrders(req.user!.id, orderQuerySchema.parse(req.query));

  res.status(200).json({ success: true, data: result });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getOrders(orderQuerySchema.parse(req.query));

  res.status(200).json({ success: true, data: result });
});

export const findById = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderById(String(req.params.id), req.user!);

  res.status(200).json({ success: true, data: { order } });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await updateOrderStatus(String(req.params.id), req.body);

  res.status(200).json({ success: true, data: { order } });
});

export const cancelMine = asyncHandler(async (req: Request, res: Response) => {
  const order = await cancelMyOrder(String(req.params.id), req.user!.id);

  res.status(200).json({ success: true, data: { order } });
});
