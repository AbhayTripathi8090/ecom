import { api } from "../../lib/api";
import { ORDER_ENDPOINTS } from "./order.endpoints";
import type { Order, CreateOrderInput, OrderWorkflowStatus } from "./order.types";

export const orderService = {
  createOrder: async (input: CreateOrderInput): Promise<Order> => {
    const res: any = await api.post(ORDER_ENDPOINTS.CREATE, input);
    const data = res.data || res;
    return data.order || data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res: any = await api.get(ORDER_ENDPOINTS.MY_ORDERS);
    const data = res.data || res;
    return data.orders || data.items || data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const res: any = await api.get(ORDER_ENDPOINTS.ALL_ORDERS);
    const data = res.data || res;
    return data.orders || data.items || data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res: any = await api.get(ORDER_ENDPOINTS.DETAIL(id));
    const data = res.data || res;
    return data.order || data;
  },

  updateOrderStatus: async (id: string, orderStatus: OrderWorkflowStatus): Promise<Order> => {
    const res: any = await api.patch(ORDER_ENDPOINTS.UPDATE_STATUS(id), { orderStatus });
    const data = res.data || res;
    return data.order || data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const res: any = await api.patch(ORDER_ENDPOINTS.CANCEL(id));
    const data = res.data || res;
    return data.order || data;
  },
};
