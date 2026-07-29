import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProductsThunk, selectProducts, selectProductLoading } from "../../features/product";
import { formatCurrency } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";

export const AdminProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const isLoading = useAppSelector(selectProductLoading);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 50 }));
  }, [dispatch]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            Products Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage store product listings, prices, and stock inventory
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const stock = (product as any).stockQuantity ?? (product as any).stock ?? 10;
                  return (
                    <tr key={product.id} className="hover:bg-slate-900/40">
                      <td className="p-4 font-medium text-white flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            PROD
                          </div>
                        )}
                        <span>{product.name}</span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {typeof product.category === "object"
                          ? product.category?.name
                          : "General"}
                      </td>
                      <td className="p-4 font-semibold text-slate-200">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            stock > 5
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {stock} units
                        </span>
                      </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
