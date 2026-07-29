import { api } from "../../lib/api";
import { PAYMENT_ENDPOINTS } from "./payment.endpoints";
import type { Payment, PaymentStatus } from "./payment.types";

export const paymentService = {
  getPaymentByOrder: async (orderId: string): Promise<Payment> => {
    const res: any = await api.get(PAYMENT_ENDPOINTS.BY_ORDER(orderId));
    const data = res.data || res;
    return data.payment || data;
  },

  getAllPayments: async (): Promise<Payment[]> => {
    const res: any = await api.get(PAYMENT_ENDPOINTS.ALL);
    const data = res.data || res;
    return data.payments || data.items || data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus | string): Promise<Payment> => {
    const status = paymentStatus.toLowerCase() === "successful" ? "paid" : paymentStatus.toLowerCase();
    const res: any = await api.patch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), { status });
    const data = res.data || res;
    return data.payment || data;
  },
};
