import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.service";

export const findMyCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getCart(req.user!.id);

  res.status(200).json({ success: true, data: { cart } });
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await addCartItem(req.user!.id, req.body);

  res.status(200).json({ success: true, data: { cart } });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await updateCartItem(
    req.user!.id,
    String(req.params.productId),
    req.body,
  );

  res.status(200).json({ success: true, data: { cart } });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await removeCartItem(req.user!.id, String(req.params.productId));

  res.status(200).json({ success: true, data: { cart } });
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  const cart = await clearCart(req.user!.id);

  res.status(200).json({ success: true, data: { cart } });
});
