import type { RootState } from "../../store";

export const selectSavedAddresses = (state: RootState) => state.shipping.addresses;
export const selectCurrentShipment = (state: RootState) => state.shipping.currentShipment;
export const selectShippingLoading = (state: RootState) => state.shipping.isLoading;
export const selectShippingError = (state: RootState) => state.shipping.error;
