import React, { useEffect } from "react";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCategoriesThunk, selectCategories, selectCategoryLoading } from "../../features/category";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";

export const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoryLoading);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-400" />
            Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize catalog categories and product classifications
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {isLoading && categories.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-400">{cat.slug || cat.name.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                {cat.description || "Category description and product filtering configurations."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
