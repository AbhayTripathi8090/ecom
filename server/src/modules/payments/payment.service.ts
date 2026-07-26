import mongoose from "mongoose";
import { AppError } from "../../utils/AppError";
import { getPagination, type PaginationMeta } from "../../utils/pagination";
import { Order } from "../orders/order.model";
import { Payment } from "./payment.model";
import type {
  PaymentQueryInput,
  UpdatePaymentStatusInput,
} from "./payment.validation";

const paymentPopulate = [
  { path: "user", select: "name email" },
  { path: "order", select: "orderNumber totalAmount paymentStatus orderStatus" },
];

export const getPayments = async (
  query: PaymentQueryInput,
): Promise<{ payments: unknown[]; meta: PaginationMeta }> => {
  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  }

  const skip = (query.page - 1) * query.limit;
  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate(paymentPopulate)
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    meta: getPagination(query.page, query.limit, total),
  };
};

export const getPaymentById = async (
  paymentId: string,
  requester: { id: string; role: string },
) => {
  const payment = await Payment.findById(paymentId).populate(paymentPopulate);

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (requester.role !== "admin" && payment.user._id.toString() !== requester.id) {
    throw new AppError("You do not have permission to access this payment", 403);
  }

  return payment;
};

export const getPaymentByOrder = async (
  orderId: string,
  requester: { id: string; role: string },
) => {
  const payment = await Payment.findOne({ order: orderId }).populate(paymentPopulate);

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (requester.role !== "admin" && payment.user._id.toString() !== requester.id) {
    throw new AppError("You do not have permission to access this payment", 403);
  }

  return payment;
};

export const updatePaymentStatus = async (
  paymentId: string,
  input: UpdatePaymentStatusInput,
) => {
  const session = await mongoose.startSession();

  try {
    let updatedPaymentId = "";

    await session.withTransaction(async () => {
      const payment = await Payment.findById(paymentId).session(session);

      if (!payment) {
        throw new AppError("Payment not found", 404);
      }

      payment.status = input.status;

      if (input.provider) {
        payment.provider = input.provider;
      }

      if (input.transactionId) {
        payment.transactionId = input.transactionId;
      }

      if (input.failureReason) {
        payment.failureReason = input.failureReason;
      }

      if (input.status === "paid") {
        payment.paidAt = new Date();
      }

      const order = await Order.findById(payment.order).session(session);

      if (!order) {
        throw new AppError("Associated order not found", 404);
      }

      order.paymentStatus = input.status;

      if (input.status === "paid" && ["pending", "confirmed"].includes(order.orderStatus)) {
        order.orderStatus = "confirmed";
      }

      if (input.status === "failed") {
        order.orderStatus = order.orderStatus === "pending" ? "pending" : order.orderStatus;
      }

      await Promise.all([payment.save({ session }), order.save({ session })]);
      updatedPaymentId = payment._id.toString();
    });

    return Payment.findById(updatedPaymentId).populate(paymentPopulate);
  } finally {
    await session.endSession();
  }
};
