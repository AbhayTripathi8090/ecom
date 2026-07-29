import React, { useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchProductsThunk,
  selectProducts,
  selectProductLoading,
  productService,
  type Product,
} from "../../features/product";
import {
  fetchCategoriesThunk,
  selectCategories,
} from "../../features/category";
import { formatCurrency } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  discountPrice: string;
  stock: string;
  sku: string;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discountPrice: "",
  stock: "0",
  sku: "",
  isFeatured: false,
  isActive: true,
};

const buildProductFormData = (
  form: ProductFormState,
  files: FileList | null,
): FormData => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value === "" && key !== "description") return;
    formData.append(key, String(value));
  });

  Array.from(files || []).forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

export const AdminProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectProductLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 50 }));
    dispatch(fetchCategoriesThunk({ limit: 100, isActive: true }));
  }, [dispatch]);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [products, searchTerm],
  );

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFiles(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug || "",
      description: product.description,
      category:
        typeof product.category === "object"
          ? product.category.id
          : String(product.category),
      brand: product.brand || "",
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      stock: String(product.stock),
      sku: product.sku,
      isFeatured: !!product.isFeatured,
      isActive: product.isActive !== false,
    });
    setImageFiles(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildProductFormData(form, imageFiles);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success("Product updated");
      } else {
        await productService.createProduct(payload);
        toast.success("Product created");
      }

      setIsFormOpen(false);
      setEditingProduct(null);
      setForm(emptyForm);
      setImageFiles(null);
      dispatch(fetchProductsThunk({ limit: 50 }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;

    try {
      await productService.deleteProduct(product.id);
      toast.success("Product deleted");
      dispatch(fetchProductsThunk({ limit: 50 }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            Products Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage listings, pricing, images, featured state, and stock.
          </p>
        </div>
        <Button onClick={openCreateForm} variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
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
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label="Price" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Discount Price" type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
            <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <div className="w-full flex flex-col space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={editingProduct ? "Replace Images" : "Images"}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
            />
          </div>

          <div className="w-full flex flex-col space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      )}

      <div className="glass-card p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
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
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          PROD
                        </div>
                      )}
                      <span>{product.name}</span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {typeof product.category === "object" ? product.category?.name : "General"}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{formatCurrency(product.discountPrice || product.price)}</td>
                    <td className="p-4">{product.stock} units</td>
                    <td className="p-4">
                      <span className={product.isActive === false ? "text-rose-400" : "text-emerald-400"}>
                        {product.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openEditForm(product)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
