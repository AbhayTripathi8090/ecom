import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, Star, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchWishlistThunk,
  removeFromWishlistThunk,
  clearWishlistThunk,
  selectWishlistItems,
  selectIsWishlistLoading,
} from "../../features/wishlist";
import { addToCartThunk } from "../../features/cart";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";

export const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const wishlistItems = useAppSelector(selectWishlistItems);
  const isLoading = useAppSelector(selectIsWishlistLoading);

  useEffect(() => {
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlistThunk(productId));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlistThunk());
  };

  const handleAddToCart = async (product: any) => {
    await dispatch(
      addToCartThunk({
        productId: product.id || product._id,
        quantity: 1,
      }),
    );
  };

  if (isLoading && wishlistItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
            My Saved Wishlist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep track of items you love and save them for later purchase ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            className="self-start sm:self-auto text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Browse our merchandise catalog and tap the heart icon on any product to save it here.
          </p>
          <div className="pt-2">
            <Link to="/products">
              <Button variant="primary" className="inline-flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Wishlist Item Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const pId = product.id || (product as any)._id;
            const mainImg = product.images?.[0]?.url;

            return (
              <div
                key={pId}
                className="group glass-card rounded-2xl border border-slate-800 overflow-hidden hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image & Remove Button */}
                  <div className="relative aspect-square bg-slate-900/80 overflow-hidden flex items-center justify-center">
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-slate-700" />
                    )}

                    <button
                      onClick={() => handleRemoveFromWishlist(pId)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-rose-500/80 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-lg"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{product.brand || "IdeaCraft"}</span>
                      {product.ratings && (
                        <div className="flex items-center space-x-1 text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.ratings.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <Link to={`/products/${pId}`}>
                      <h3 className="font-semibold text-white group-hover:text-rose-400 transition-colors line-clamp-1 text-base">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Actions */}
                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-500 line-through ml-2">
                          {formatCurrency(product.discountPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/products/${pId}`)}
                      className="w-full flex items-center justify-center gap-1 text-xs"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
