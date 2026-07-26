import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Layers } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchCategoriesThunk,
  selectCategories,
  selectCategoryLoading,
} from "../../features/category";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const CategoryListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoryLoading);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const defaultCategories = [
    { name: "T-Shirts", slug: "t-shirts", desc: "Custom printed crewnecks & tees" },
    { name: "Hoodies", slug: "hoodies", desc: "Cozy heavy fleece sweatshirts" },
    { name: "Caps", slug: "caps", desc: "Embroidered snapbacks & dad hats" },
    { name: "Mugs", slug: "mugs", desc: "Sublimation ceramic coffee mugs" },
    { name: "Bottles", slug: "bottles", desc: "Insulated stainless steel bottles" },
    { name: "Tote Bags", slug: "tote-bags", desc: "Eco canvas printed tote bags" },
    { name: "Stickers", slug: "stickers", desc: "Durable die-cut vinyl stickers" },
  ];

  const displayList = categories.length > 0 ? categories : defaultCategories;

  if (isLoading && categories.length === 0) {
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
          <Layers className="w-3.5 h-3.5" />
          <span>Merchandise Categories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Browse By Product Category
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Explore custom printable merchandise across apparel, drinkware, accessories, and promotional items.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayList.map((cat: any, idx: number) => (
          <Link
            key={cat.id || cat.slug || idx}
            to={`/products?category=${cat.id || cat.slug}`}
            className="group glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <ShoppingBag className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {cat.description || cat.desc || "Customizable merchandise items."}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-400">
              <span>View Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
