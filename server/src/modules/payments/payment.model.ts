import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["cod", "card", "upi", "netbanking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    provider: {
      type: String,
      trim: true,
      default: "manual",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paidAt: Date,
    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

paymentSchema.index({ user: 1, createdAt: -1 });

export const Payment = model("Payment", paymentSchema);
