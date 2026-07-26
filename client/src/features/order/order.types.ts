import type { Product } from "../product/product.types";
import type { CartCustomization } from "../cart/cart.types";

export type OrderWorkflowStatus =
  | "Order Placed"
  | "Payment Verified"
  | "Design Approved"
  | "Printing In Progress"
  | "Quality Check"
  | "Packed"
  | "Shipment Created"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export const ORDER_WORKFLOW_STEPS: OrderWorkflowStatus[] = [
  "Order Placed",
  "Payment Verified",
  "Design Approved",
  "Printing In Progress",
  "Quality Check",
  "Packed",
  "Shipment Created",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  customization?: CartCustomization;
  itemTotal: number;
}

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TimelineStep {
  status: OrderWorkflowStatus;
  timestamp?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: any;
  items: OrderItem[];
  shippingAddress: ShippingAddressInput;
  paymentMethod: "Razorpay" | "Stripe" | "Credit Card" | "UPI" | "Mock Payment";
  paymentStatus: "Pending" | "Successful" | "Failed" | "Refunded";
  orderStatus: OrderWorkflowStatus;
  subtotal: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;
  trackingNumber?: string;
  courierName?: string;
  timeline?: TimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
    customization?: CartCustomization;
  }>;
  shippingAddress: ShippingAddressInput;
  paymentMethod: string;
}

export interface OrderState {
  myOrders: Order[];
  allOrders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
