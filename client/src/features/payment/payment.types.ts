export type PaymentStatus = "Pending" | "Successful" | "Failed" | "Refunded";

export interface Payment {
  id: string;
  orderId: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentState {
  currentPayment: Payment | null;
  allPayments: Payment[];
  isLoading: boolean;
  error: string | null;
}
