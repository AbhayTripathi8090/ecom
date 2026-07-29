import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const WishlistPage: React.FC = () => {
  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
          My Saved Wishlist
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep track of items you love and save them for later purchase
        </p>
      </div>

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
    </div>
  );
};
