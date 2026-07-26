import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  updateAddress,
  updateOrderShippingStatus,
} from "./shipping.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const address = await createAddress(req.user!.id, req.body);

  res.status(201).json({ success: true, data: { address } });
});

export const findMine = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await getMyAddresses(req.user!.id);

  res.status(200).json({ success: true, data: { addresses } });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const address = await updateAddress(req.user!.id, String(req.params.id), req.body);

  res.status(200).json({ success: true, data: { address } });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteAddress(req.user!.id, String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Shipping address deleted successfully",
  });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await updateOrderShippingStatus(String(req.params.orderId), req.body);

  res.status(200).json({ success: true, data: { order } });
});
