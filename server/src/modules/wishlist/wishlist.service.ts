import { AppError } from "../../utils/AppError";
import { Product } from "../products/product.model";
import { Wishlist } from "./wishlist.model";

export const getWishlist = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  const productExists = await Product.findById(productId);
  if (!productExists) {
    throw new AppError("Product not found", 404);
  }

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [productId] });
  } else {
    const isAlreadyInWishlist = wishlist.products.some(
      (pId: any) => pId.toString() === productId,
    );
    if (!isAlreadyInWishlist) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }
  }

  return Wishlist.findById(wishlist._id).populate("products");
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    return wishlist;
  }

  wishlist.products = wishlist.products.filter(
    (pId: any) => pId.toString() !== productId,
  );
  await wishlist.save();

  return Wishlist.findById(wishlist._id).populate("products");
};

export const clearWishlist = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  } else {
    wishlist.products = [];
    await wishlist.save();
  }
  return wishlist;
};
