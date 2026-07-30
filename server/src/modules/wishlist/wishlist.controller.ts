import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.service";

export const findMyWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await getWishlist(req.user!.id);
  res.status(200).json({ success: true, data: { wishlist } });
});

export const addItemToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await addToWishlist(req.user!.id, req.body.productId);
  res.status(200).json({ success: true, data: { wishlist } });
});

export const removeItemFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await removeFromWishlist(req.user!.id, String(req.params.productId));
  res.status(200).json({ success: true, data: { wishlist } });
});

export const clearMyWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await clearWishlist(req.user!.id);
  res.status(200).json({ success: true, data: { wishlist } });
});
