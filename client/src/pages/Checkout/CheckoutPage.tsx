import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CreditCard, MapPin, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCartItems, selectCartSummary, clearCartThunk, clearCartLocal } from "../../features/cart";
import { createOrderThunk, selectOrderLoading } from "../../features/order";
import { fetchMyAddressesThunk, selectSavedAddresses } from "../../features/shipping";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);
  const isOrderLoading = useAppSelector(selectOrderLoading);
  const savedAddresses = useAppSelector(selectSavedAddresses);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("Mock Payment");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchMyAddressesThunk());
  }, [dispatch]);

  const handleSelectSavedAddress = (saved: any) => {
    setAddress({
      fullName: saved.fullName || "",
      phone: saved.phone || "",
      addressLine1: saved.addressLine1 || "",
      addressLine2: saved.addressLine2 || "",
      city: saved.city || "",
      state: saved.state || "",
      postalCode: saved.postalCode || "",
      country: saved.country || "India",
    });
    toast.success("Loaded saved address details");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.postalCode) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/products");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 1. Simulate Payment Verification Step
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const orderInput = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          customization: item.customization,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const resultAction = await dispatch(createOrderThunk(orderInput));

      if (createOrderThunk.fulfilled.match(resultAction)) {
        const createdOrder = resultAction.payload;
        dispatch(clearCartLocal());
        dispatch(clearCartThunk());
        toast.success("Payment Verified! Order Placed Successfully.");
        navigate(`/orders/${createdOrder.id}`);
      } else {
        toast.error(resultAction.payload || "Failed to place order.");
      }
    } catch {
      toast.error("An error occurred during order checkout.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure Checkout</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Checkout & Order Placement</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Section */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                Shipping & Delivery Address
              </h2>
            </div>

            {savedAddresses.length > 0 && (
              <div className="space-y-2 pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Select Saved Address:</span>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((sa) => (
                    <button
                      key={sa.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(sa)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      {sa.fullName} ({sa.city})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="John Doe"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                required
              />
              <Input
                label="Phone Number *"
                placeholder="+91 9876543210"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
              />
            </div>

            <Input
              label="Address Line 1 *"
              placeholder="House/Flat No., Building, Street Name"
              value={address.addressLine1}
              onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
              required
            />

            <Input
              label="Address Line 2 (Optional)"
              placeholder="Landmark, Area, Suite"
              value={address.addressLine2}
              onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City *"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <Input
                label="State *"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
              />
              <Input
                label="Postal Code *"
                placeholder="PIN/Zip Code"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Payment Gateway Selection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Razorpay", desc: "Cards, NetBanking, UPI" },
                { name: "Stripe", desc: "International Cards" },
                { name: "Mock Payment", desc: "Instant Sandbox Payment" },
              ].map((pm) => (
                <button
                  key={pm.name}
                  type="button"
                  onClick={() => setPaymentMethod(pm.name)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === pm.name
                      ? "border-indigo-500 bg-indigo-500/10 text-white ring-2 ring-indigo-500/30"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="font-semibold text-sm">{pm.name}</span>
                    {paymentMethod === pm.name && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <span className="text-[11px] text-slate-500">{pm.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Order Items ({cartItems.length})</h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-200 line-clamp-1">{item.product?.name}</span>
                    <span className="text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-200">{formatCurrency(item.itemTotal || item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax</span>
                <span>{formatCurrency(summary.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping</span>
                <span>{summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-extrabold text-white border-t border-slate-800 pt-4">
              <span>Total Pay</span>
              <span className="text-indigo-400">{formatCurrency(summary.total)}</span>
            </div>

            <Button
              type="submit"
              isLoading={isProcessingPayment || isOrderLoading}
              className="w-full"
              size="lg"
              variant="primary"
            >
              Confirm & Pay {formatCurrency(summary.total)}
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bank Grade 256-bit SSL Payment Gateway</span>
          </div>
        </div>
      </form>
    </div>
  );
};
