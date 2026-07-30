import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, ArrowUpDown, ShoppingBag, Star, Sparkles, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchProductsThunk,
  selectProducts,
  selectProductLoading,
} from "../../features/product";
import {
  fetchCategoriesThunk,
  selectCategories,
} from "../../features/category";
import {
  fetchWishlistThunk,
  addToWishlistThunk,
  removeFromWishlistThunk,
  selectWishlistItems,
} from "../../features/wishlist";
import { selectAuth } from "../../features/auth";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/ui/Input";
import { formatCurrency } from "../../utils/formatters";

export const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectProductLoading);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const { isAuthenticated } = useAppSelector(selectAuth);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "-createdAt");

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    if (isAuthenticated) {
      dispatch(fetchWishlistThunk());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const query: any = {};
    if (searchQuery) query.search = searchQuery;
    if (selectedCategory) query.category = selectedCategory;
    if (sortOption) query.sort = sortOption;

    dispatch(fetchProductsThunk(query));
  }, [dispatch, searchQuery, selectedCategory, sortOption]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId) {
      searchParams.set("category", catId);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleToggleWishlist = (productId: string, inWishlist: boolean) => {
    if (inWishlist) {
      dispatch(removeFromWishlistThunk(productId));
    } else {
      dispatch(addToWishlistThunk(productId));
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Custom Merchandise Store</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Custom Products & Merchandise
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Browse items, pick custom print options (DTF, Screen Printing, Embroidery), upload artwork, and place custom orders.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Input
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Category & Sort controls */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          {/* Category Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300">
            <Filter className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Filter by Category"
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-indigo-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort Products"
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="-createdAt" className="bg-slate-900">Newest Arrival</option>
              <option value="price" className="bg-slate-900">Price: Low to High</option>
              <option value="-price" className="bg-slate-900">Price: High to Low</option>
              <option value="name" className="bg-slate-900">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No products found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or category filters to find merchandise items.
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const mainImg = product.images?.[0]?.url;
            const inWishlist = wishlistItems.some(
              (item) => item.id === product.id || (item as any)._id === product.id,
            );

            return (
              <div
                key={product.id}
                className="group glass-card rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
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
                    {product.discountPrice && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        Sale
                      </span>
                    )}

                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleWishlist(product.id, inWishlist);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                          inWishlist
                            ? "bg-rose-500 text-white"
                            : "bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`}
                        />
                      </button>
                    )}
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

                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 text-base">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="p-5 pt-0 flex items-center justify-between">
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
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
