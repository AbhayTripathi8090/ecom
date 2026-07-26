import type { ShippingAddressInput } from "../order/order.types";

export interface SavedAddress extends ShippingAddressInput {
  id: string;
  label?: string;
  isDefault?: boolean;
}

export interface ShipmentDetails {
  courierName: string;
  trackingNumber: string;
  shipmentId: string;
  estimatedDeliveryDate?: string;
  shippingStatus: string;
}

export interface ShippingState {
  addresses: SavedAddress[];
  currentShipment: ShipmentDetails | null;
  isLoading: boolean;
  error: string | null;
}
