import { api } from "../../lib/api";
import { SHIPPING_ENDPOINTS } from "./shipping.endpoints";
import type { SavedAddress, ShipmentDetails } from "./shipping.types";
import type { ShippingAddressInput } from "../order/order.types";

export const shippingService = {
  getMyAddresses: async (): Promise<SavedAddress[]> => {
    try {
      const res: any = await api.get(SHIPPING_ENDPOINTS.ADDRESSES);
      const data = res.data || res;
      return data.addresses || data.items || data;
    } catch {
      return [];
    }
  },

  createAddress: async (input: ShippingAddressInput): Promise<SavedAddress> => {
    const res: any = await api.post(SHIPPING_ENDPOINTS.ADDRESSES, input);
    const data = res.data || res;
    return data.address || data;
  },

  updateAddress: async (id: string, input: Partial<ShippingAddressInput>): Promise<SavedAddress> => {
    const res: any = await api.patch(SHIPPING_ENDPOINTS.ADDRESS_BY_ID(id), input);
    const data = res.data || res;
    return data.address || data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(SHIPPING_ENDPOINTS.ADDRESS_BY_ID(id));
  },

  updateOrderShippingStatus: async (orderId: string, statusData: any): Promise<ShipmentDetails> => {
    const res: any = await api.patch(SHIPPING_ENDPOINTS.UPDATE_ORDER_SHIPPING(orderId), statusData);
    const data = res.data || res;
    return data.shipment || data;
  },
};
