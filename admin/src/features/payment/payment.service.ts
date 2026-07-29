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

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus): Promise<Payment> => {
    const res: any = await api.patch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), { paymentStatus });
    const data = res.data || res;
    return data.payment || data;
  },
};
