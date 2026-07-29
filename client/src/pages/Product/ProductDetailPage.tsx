import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  Upload,
  Check,
  Star,
  ShieldCheck,
  Truck,
  Palette,
  Layers,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchProductByIdThunk,
  selectSelectedProduct,
  selectProductLoading,
} from "../../features/product";
import { addToCartThunk } from "../../features/cart";
import type { MerchandiseSize, PrintType, PrintLocation } from "../../features/product";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";

const SIZES: MerchandiseSize[] = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#0f172a" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Heather Grey", hex: "#64748b" },
  { name: "Red", hex: "#dc2626" },
  { name: "Royal Blue", hex: "#2563eb" },
];
const PRINT_TYPES: PrintType[] = [
  "DTF Printing",
  "Screen Printing",
  "Sublimation",
  "Embroidery",
  "UV Printing",
];
const PRINT_LOCATIONS: PrintLocation[] = ["Front", "Back", "Left Chest", "Right Sleeve"];

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectSelectedProduct);
  const isLoading = useAppSelector(selectProductLoading);

  const [selectedSize, setSelectedSize] = useState<MerchandiseSize>("L");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedPrintType, setSelectedPrintType] = useState<PrintType>("DTF Printing");
  const [selectedPrintLocation, setSelectedPrintLocation] = useState<PrintLocation>("Front");
  const [quantity, setQuantity] = useState<number>(1);

  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Design artwork file must be under 10MB");
        return;
      }
      setArtworkFile(file);
      setArtworkPreview(URL.createObjectURL(file));
      toast.success("Artwork design uploaded!");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const resultAction = await dispatch(
      addToCartThunk({
        productId: product.id,
        quantity,
        customization: {
          size: selectedSize,
          color: selectedColor,
          printType: selectedPrintType,
          printLocation: selectedPrintLocation,
        },
      }),
    );

    if (addToCartThunk.fulfilled.match(resultAction)) {
      toast.success(`Added ${quantity} ${product.name} to cart`);
      return;
    }

    toast.error(resultAction.payload || "Please login to add items to cart");
  };

  if (isLoading && !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const unitPrice = product.discountPrice || product.price;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="space-y-8 py-4">
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery & Artwork Mockup */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
            {product.images?.[selectedImageIndex]?.url ? (
              <img
                src={product.images[selectedImageIndex].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingBag className="w-20 h-20 text-slate-700" />
            )}

            {/* Live Design Artwork Overlay Preview */}
            {artworkPreview && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                <div className="relative max-w-[40%] max-h-[40%] p-2 rounded-xl bg-slate-950/70 border border-indigo-500/50 backdrop-blur-sm shadow-2xl animate-fade-in">
                  <img
                    src={artworkPreview}
                    alt="Uploaded Artwork"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full">
                    {selectedPrintLocation}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.publicId || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Merchandise Customization Studio */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.brand || "IdeaCraft Custom"}
            </span>
            <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>
            <p className="text-slate-400 text-sm">{product.description}</p>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center space-x-4 border-y border-slate-800/80 py-4">
            <div>
              <span className="text-3xl font-bold text-white">
                {formatCurrency(unitPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-slate-500 line-through ml-2">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {product.ratings && (
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-sm text-amber-400 font-medium">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratings.average.toFixed(1)}</span>
                <span className="text-slate-500">({product.ratings.count})</span>
              </div>
            )}
          </div>

          {/* Customization Options */}
          <div className="space-y-5">
            {/* 1. Size Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                        : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-400" />
                Select Merchandise Color ({selectedColor})
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === c.name
                        ? "border-indigo-500 ring-2 ring-indigo-500/50 scale-110"
                        : "border-slate-800 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check className={`w-4 h-4 ${c.name === "White" ? "text-slate-950" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Print Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Print Technique Type
              </label>
              <select
                value={selectedPrintType}
                onChange={(e) => setSelectedPrintType(e.target.value as PrintType)}
                aria-label="Select Print Technique Type"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {PRINT_TYPES.map((pt) => (
                  <option key={pt} value={pt} className="bg-slate-900">
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Print Location Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Print Location
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRINT_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedPrintLocation(loc)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedPrintLocation === loc
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Artwork / Design Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Upload Custom Artwork / Design</span>
                <span className="text-[10px] text-indigo-400 font-semibold">PNG, JPG or SVG</span>
              </label>
              <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-900/40 cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-indigo-400 mb-1" />
                <span className="text-xs text-slate-300 font-medium">
                  {artworkFile ? artworkFile.name : "Click to browse artwork file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArtworkChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* 6. Quantity Counter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Summary & Add to Cart */}
          <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Customization Price:</span>
              <span className="text-2xl font-extrabold text-indigo-400">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              variant="primary"
              disabled={!product.isActive || product.stock < 1}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Add Custom Merchandise To Cart
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 pt-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Quality Print Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>Fast Track Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
