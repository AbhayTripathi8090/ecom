import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchCartThunk,
  removeCartItemThunk,
  updateCartItemThunk,
  selectCartItems,
  selectCartSummary,
  selectCartLoading,
  removeItemLocal,
  updateQuantityLocal,
} from "../../features/cart";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);
  const isLoading = useAppSelector(selectCartLoading);

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const handleUpdateQuantity = (id: string, productId: string, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateQuantityLocal({ id, quantity: newQty }));
    dispatch(updateCartItemThunk({ productId, input: { quantity: newQty } }));
  };

  const handleRemoveItem = (id: string, productId: string) => {
    dispatch(removeItemLocal(id));
    dispatch(removeCartItemThunk(productId));
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shopping Cart</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Your Merchandise Cart</h1>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven't added any custom merchandise to your cart yet. Explore our products and start customizing!
          </p>
          <Link to="/products">
            <Button size="lg" variant="primary" className="mt-2">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        /* Cart Items & Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const product = item.product || {};
              const mainImg = product.images?.[0]?.url;
              return (
                <div
                  key={item.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-800">
                      {mainImg ? (
                        <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-base">{product.name || "Custom Item"}</h3>
                      <p className="text-xs text-slate-400">
                        Unit Price: <span className="text-slate-200 font-semibold">{formatCurrency(item.price)}</span>
                      </p>

                      {/* Customization Details Badges */}
                      {item.customization && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.customization.size && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                              Size: {item.customization.size}
                            </span>
                          )}
                          {item.customization.color && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-md">
                              Color: {item.customization.color}
                            </span>
                          )}
                          {item.customization.printType && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-md">
                              {item.customization.printType}
                            </span>
                          )}
                          {item.customization.printLocation && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                              Loc: {item.customization.printLocation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-white">
                        {formatCurrency(item.itemTotal || item.price * item.quantity)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id, product.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <Link to="/products" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Order Summary</h3>

              <div className="space-y-3 text-sm text-slate-300 border-y border-slate-800 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Tax (10%)</span>
                  <span className="font-semibold text-white">{formatCurrency(summary.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping Charges</span>
                  <span className="font-semibold text-white">
                    {summary.shipping === 0 ? <span className="text-emerald-400">FREE</span> : formatCurrency(summary.shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-extrabold text-white">
                <span>Final Amount</span>
                <span className="text-indigo-400">{formatCurrency(summary.total)}</span>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full"
                size="lg"
                variant="primary"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Checkout & Order Guarantee</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
