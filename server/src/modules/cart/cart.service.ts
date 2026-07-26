import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { Product } from "../products/product.model";
import { Cart } from "./cart.model";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.validation";

const cartPopulate = {
  path: "items.product",
  select: "name slug price discountPrice stock sku images isActive",
};

const getProductSalePrice = (product: {
  price: number;
  discountPrice?: number | null;
}): number => product.discountPrice ?? product.price;

const recalculateCart = (cart: {
  items: Array<{ quantity: number; price: number }>;
  totalItems: number;
  totalAmount: number;
}): void => {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
};

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate(cartPopulate);

  if (cart) {
    return cart;
  }

  return Cart.create({ user: userId, items: [] });
};

export const addCartItem = async (userId: string, input: AddCartItemInput) => {
  const product = await Product.findOne({
    _id: input.productId,
    isActive: true,
  }).select("price discountPrice stock");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < input.quantity) {
    throw new AppError("Not enough stock available", 400);
  }

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true },
  );
  const productId = new Types.ObjectId(input.productId);
  const item = cart.items.find((cartItem) =>
    cartItem.product.equals(productId),
  );

  if (item) {
    const nextQuantity = item.quantity + input.quantity;

    if (product.stock < nextQuantity) {
      throw new AppError("Not enough stock available", 400);
    }

    item.quantity = nextQuantity;
    item.price = getProductSalePrice(product);
  } else {
    cart.items.push({
      product: productId,
      quantity: input.quantity,
      price: getProductSalePrice(product),
    });
  }

  recalculateCart(cart);
  await cart.save();

  return cart.populate(cartPopulate);
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  input: UpdateCartItemInput,
) => {
  const [cart, product] = await Promise.all([
    Cart.findOne({ user: userId }),
    Product.findOne({ _id: productId, isActive: true }).select(
      "price discountPrice stock",
    ),
  ]);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < input.quantity) {
    throw new AppError("Not enough stock available", 400);
  }

  const item = cart.items.find((cartItem) =>
    cartItem.product.equals(productId),
  );

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  item.quantity = input.quantity;
  item.price = getProductSalePrice(product);

  recalculateCart(cart);
  await cart.save();

  return cart.populate(cartPopulate);
};

export const removeCartItem = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const nextItems = cart.items.filter(
    (item) => !item.product.equals(productId),
  );
  cart.items.splice(0, cart.items.length, ...nextItems);
  recalculateCart(cart);
  await cart.save();

  return cart.populate(cartPopulate);
};

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalItems: 0, totalAmount: 0 },
    { new: true, upsert: true },
  );

  return cart.populate(cartPopulate);
};
