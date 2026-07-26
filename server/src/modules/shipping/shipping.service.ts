import { AppError } from "../../utils/AppError";
import { Order } from "../orders/order.model";
import { ShippingAddress } from "./shipping.model";
import type {
  AddressInput,
  UpdateAddressInput,
  UpdateShippingStatusInput,
} from "./shipping.validation";

const normalizeDefaultAddress = async (
  userId: string,
  isDefault?: boolean,
): Promise<void> => {
  if (!isDefault) {
    return;
  }

  await ShippingAddress.updateMany({ user: userId }, { isDefault: false });
};

export const createAddress = async (userId: string, input: AddressInput) => {
  await normalizeDefaultAddress(userId, input.isDefault);

  return ShippingAddress.create({
    ...input,
    user: userId,
  });
};

export const getMyAddresses = async (userId: string) =>
  ShippingAddress.find({ user: userId }).sort("-isDefault -createdAt");

export const updateAddress = async (
  userId: string,
  addressId: string,
  input: UpdateAddressInput,
) => {
  const address = await ShippingAddress.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Shipping address not found", 404);
  }

  await normalizeDefaultAddress(userId, input.isDefault);

  Object.assign(address, input);
  await address.save();

  return address;
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await ShippingAddress.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Shipping address not found", 404);
  }
};

export const updateOrderShippingStatus = async (
  orderId: string,
  input: UpdateShippingStatusInput,
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.orderStatus = input.orderStatus;

  if (input.trackingNumber) {
    order.trackingNumber = input.trackingNumber;
  }

  if (input.orderStatus === "delivered") {
    order.deliveredAt = new Date();
  } else if (order.orderStatus !== "delivered") {
    order.deliveredAt = undefined;
  }

  await order.save();

  return order;
};
