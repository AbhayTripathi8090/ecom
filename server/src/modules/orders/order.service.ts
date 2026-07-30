import mongoose from "mongoose";
import { AppError } from "../../utils/AppError";
import { getPagination, type PaginationMeta } from "../../utils/pagination";
import { Cart } from "../cart/cart.model";
import { Payment } from "../payments/payment.model";
import { Product } from "../products/product.model";
import { Order } from "./order.model";
import type {
  CreateOrderInput,
  OrderQueryInput,
  UpdateOrderStatusInput,
} from "./order.validation";

const orderPopulate = [
  { path: "user", select: "name email" },
  { path: "items.product", select: "name slug images price discountPrice" },
];

const generateOrderNumber = (): string =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

export const createOrderFromCart = async (
  userId: string,
  input: CreateOrderInput,
) => {
  const session = await mongoose.startSession();

  try {
    let createdOrderId = "";

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || (cart.items as any[]).length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      const orderItems = [];
      let subtotal = 0;

      for (const item of cart.items as any[]) {
        const product = await Product.findOne({
          _id: item.product,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new AppError("One or more products are no longer available", 400);
        }

        if (product.stock < item.quantity) {
          throw new AppError(`${product.name} does not have enough stock`, 400);
        }

        const price = product.discountPrice ?? product.price;
        const itemSubtotal = price * item.quantity;

        product.stock -= item.quantity;
        await product.save({ session });

        orderItems.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          quantity: item.quantity,
          price,
          subtotal: itemSubtotal,
        });
        subtotal += itemSubtotal;
      }

      const totalAmount = Math.max(
        subtotal + input.shippingFee + input.tax - input.discount,
        0,
      );
      const [order] = await Order.create(
        [
          {
            user: userId,
            orderNumber: generateOrderNumber(),
            items: orderItems,
            shippingAddress: input.shippingAddress,
            subtotal,
            shippingFee: input.shippingFee,
            tax: input.tax,
            discount: input.discount,
            totalAmount,
            paymentMethod: input.paymentMethod,
            paymentStatus: input.paymentMethod === "cod" ? "pending" : "pending",
          },
        ],
        { session },
      );

      await Payment.create(
        [
          {
            order: order._id,
            user: userId,
            amount: totalAmount,
            method: input.paymentMethod,
            status: "pending",
          },
        ],
        { session },
      );

      cart.items.splice(0, (cart.items as any[]).length);
      cart.totalItems = 0;
      cart.totalAmount = 0;
      await cart.save({ session });

      createdOrderId = order._id.toString();
    });

    return Order.findById(createdOrderId).populate(orderPopulate);
  } finally {
    await session.endSession();
  }
};

export const getMyOrders = async (userId: string, query: OrderQueryInput) => {
  return getOrders({ ...query, userId });
};

export const getOrders = async (
  query: OrderQueryInput & { userId?: string },
): Promise<{ orders: unknown[]; meta: PaginationMeta }> => {
  const filter: Record<string, unknown> = {};

  if (query.userId) {
    filter.user = query.userId;
  }

  if (query.status) {
    filter.orderStatus = query.status;
  }

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  const skip = (query.page - 1) * query.limit;
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate(orderPopulate)
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    meta: getPagination(query.page, query.limit, total),
  };
};

export const getOrderById = async (
  orderId: string,
  requester: { id: string; role: string },
) => {
  const order = await Order.findById(orderId).populate(orderPopulate);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (requester.role !== "admin" && order.user._id.toString() !== requester.id) {
    throw new AppError("You do not have permission to access this order", 403);
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  input: UpdateOrderStatusInput,
) => {
  const session = await mongoose.startSession();

  try {
    let updatedOrderId = "";

    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      const wasCancelled = order.orderStatus === "cancelled";
      order.orderStatus = input.orderStatus;

      if (input.trackingNumber) {
        order.trackingNumber = input.trackingNumber;
      }

      if (input.orderStatus === "delivered") {
        order.deliveredAt = new Date();
      }

      if (input.orderStatus === "cancelled" && !wasCancelled) {
        for (const item of order.items as any[]) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session },
          );
        }

        order.cancelledAt = new Date();
      }

      await order.save({ session });
      updatedOrderId = order._id.toString();
    });

    return Order.findById(updatedOrderId).populate(orderPopulate);
  } finally {
    await session.endSession();
  }
};

export const cancelMyOrder = async (orderId: string, userId: string) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: orderId, user: userId }).session(session);

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (!["pending", "confirmed"].includes(order.orderStatus)) {
        throw new AppError("Order cannot be cancelled now", 400);
      }

      for (const item of order.items as any[]) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
          { session },
        );
      }

      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      await order.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return Order.findById(orderId).populate(orderPopulate);
};
