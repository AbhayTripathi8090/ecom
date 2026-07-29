import type { Product } from "../product/product.types";

export type OrderWorkflowStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_WORKFLOW_STEPS: OrderWorkflowStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  customization?: any;
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
  paymentMethod: "cod" | "card" | "upi" | "netbanking";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: OrderWorkflowStatus;
  subtotal: number;
  tax: number;
  shippingCharge?: number;
  shippingFee?: number;
  totalAmount: number;
  trackingNumber?: string;
  courierName?: string;
  timeline?: TimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  shippingAddress: ShippingAddressInput;
  paymentMethod: "cod" | "card" | "upi" | "netbanking";
  shippingFee?: number;
  tax?: number;
  discount?: number;
}

export interface OrderState {
  myOrders: Order[];
  allOrders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
