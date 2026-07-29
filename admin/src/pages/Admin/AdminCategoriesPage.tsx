import React, { useEffect, useState } from "react";
import { FolderTree, Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  categoryService,
  fetchCategoriesThunk,
  selectCategories,
  selectCategoryLoading,
  type Category,
} from "../../features/category";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  parentCategory: string;
  isActive: boolean;
};

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  parentCategory: "",
  isActive: true,
};

const buildCategoryFormData = (
  form: CategoryFormState,
  imageFile?: File | null,
): FormData => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value === "" && key !== "description") return;
    formData.append(key, String(value));
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
};

export const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoryLoading);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesThunk({ limit: 100 }));
  }, [dispatch]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setImageFile(null);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug || "",
      description: category.description || "",
      parentCategory:
        typeof category.parentCategory === "object"
          ? category.parentCategory.id
          : category.parentCategory || "",
      isActive: category.isActive !== false,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = buildCategoryFormData(form, imageFile);

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.success("Category updated");
      } else {
        await categoryService.createCategory(payload);
        toast.success("Category created");
      }

      setIsFormOpen(false);
      setEditingCategory(null);
      setForm(emptyForm);
      setImageFile(null);
      dispatch(fetchCategoriesThunk({ limit: 100 }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"?`)) return;

    try {
      await categoryService.deleteCategory(category.id);
      toast.success("Category deleted");
      dispatch(fetchCategoriesThunk({ limit: 100 }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-400" />
            Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize catalog categories and product classifications.
          </p>
        </div>
        <Button onClick={openCreateForm} variant="primary" className="flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" />
            <Input label={editingCategory ? "Replace Image" : "Image"} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <div className="w-full flex flex-col space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Parent Category</label>
              <select
                value={form.parentCategory}
                onChange={(e) => setForm({ ...form, parentCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">None</option>
                {categories
                  .filter((category) => category.id !== editingCategory?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      )}

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
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="w-11 h-11 rounded-xl object-cover border border-slate-800" />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <FolderTree className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-400">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => openEditForm(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                {cat.description || "No description added."}
              </p>
              <span className={cat.isActive === false ? "text-xs text-rose-400" : "text-xs text-emerald-400"}>
                {cat.isActive === false ? "Inactive" : "Active"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
