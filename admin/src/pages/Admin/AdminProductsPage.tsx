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
  imageFiles: File[],
): FormData => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value === "" && key !== "description") return;
    formData.append(key, String(value));
  });

  imageFiles.forEach((file) => {
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 100 }));
    dispatch(fetchCategoriesThunk({ limit: 100 }));
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const productCatId =
        typeof product.category === "object"
          ? product.category.id
          : product.category;

      const matchCat =
        !selectedCategoryFilter || productCatId === selectedCategoryFilter;

      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategoryFilter]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFiles([]);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    const catId =
      typeof product.category === "object"
        ? product.category.id
        : product.category || "";

    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug || "",
      description: product.description || "",
      category: catId,
      brand: product.brand || "",
      price: String(product.price || 0),
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      stock: String(product.stock || 0),
      sku: product.sku || "",
      isFeatured: !!product.isFeatured,
      isActive: product.isActive !== false,
    });
    setImageFiles([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      setImageFiles([]);
      dispatch(fetchProductsThunk({ limit: 100 }));
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
      dispatch(fetchProductsThunk({ limit: 100 }));
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
            Manage your store's product inventory and pricing ({filteredProducts.length} Products)
          </p>
        </div>
        <Button onClick={openCreateForm} variant="primary" className="flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Discount Price ($)" type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
            <Input label="Stock Quantity" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />

            <div className="w-full flex flex-col space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label="Product Images" type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
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

          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured Product
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active in Store
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      )}

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 flex items-center space-x-3">
                      {prod.images?.[0]?.url ? (
                        <img src={prod.images[0].url} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white">{prod.name}</div>
                        <div className="text-xs text-slate-400">{prod.brand || "IdeaCraft"}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-xs text-slate-400 font-mono">{prod.sku}</td>
                    <td className="p-3.5 font-semibold text-slate-100">{formatCurrency(prod.price)}</td>
                    <td className="p-3.5">
                      <span className={prod.stock < 5 ? "text-amber-400 font-bold" : "text-slate-300"}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={prod.isActive === false ? "text-xs text-rose-400" : "text-xs text-emerald-400 font-semibold"}>
                        {prod.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => openEditForm(prod)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prod)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
