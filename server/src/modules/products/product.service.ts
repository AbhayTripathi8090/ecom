import { Types } from "mongoose";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { getPagination, type PaginationMeta } from "../../utils/pagination";
import { slugify } from "../../utils/slugify";
import { Category } from "../categories/category.model";
import { Product } from "./product.model";
import type { ProductDocument } from "./product.types";
import type {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput,
} from "./product.validation";

const productFolder = `${env.CLOUDINARY_FOLDER}/products`;
const productPopulate = {
  path: "category",
  select: "name slug image parentCategory",
};

const buildSlug = (name: string, slug?: string): string => slugify(slug ?? name);

const ensureUniqueFields = async (
  values: { slug?: string; sku?: string },
  ignoreProductId?: string,
): Promise<void> => {
  const filters = [];

  if (values.slug) {
    filters.push({ slug: values.slug });
  }

  if (values.sku) {
    filters.push({ sku: values.sku.toUpperCase() });
  }

  if (filters.length === 0) {
    return;
  }

  const existingProduct = await Product.findOne({
    $or: filters,
    ...(ignoreProductId ? { _id: { $ne: ignoreProductId } } : {}),
  }).select("slug sku");

  if (!existingProduct) {
    return;
  }

  if (values.slug && existingProduct.slug === values.slug) {
    throw new AppError("Product slug already exists", 409);
  }

  throw new AppError("Product SKU already exists", 409);
};

const ensureActiveCategory = async (categoryId: string): Promise<void> => {
  const category = await Category.exists({ _id: categoryId, isActive: true });

  if (!category) {
    throw new AppError("Category not found", 404);
  }
};

const uploadProductImages = async (
  files: Express.Multer.File[] = [],
) => Promise.all(files.map((file) => uploadImage(file.buffer, productFolder)));

const deleteProductImages = async (publicIds: string[]): Promise<void> => {
  await Promise.all(publicIds.map((publicId) => deleteImage(publicId)));
};

export const createProduct = async (
  input: CreateProductInput,
  imageFiles: Express.Multer.File[] = [],
): Promise<ProductDocument> => {
  const slug = buildSlug(input.name, input.slug);
  const sku = input.sku.toUpperCase();

  await ensureUniqueFields({ slug, sku });
  await ensureActiveCategory(input.category);

  const images = await uploadProductImages(imageFiles);
  const product = await Product.create({
    ...input,
    slug,
    sku,
    images,
  });

  return product.populate(productPopulate);
};

export const getProducts = async (
  query: ProductQueryInput,
): Promise<{ products: ProductDocument[]; meta: PaginationMeta }> => {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.brand) {
    filter.brand = new RegExp(query.brand, "i");
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};

    if (query.minPrice !== undefined) {
      (filter.price as Record<string, number>).$gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      (filter.price as Record<string, number>).$lte = query.maxPrice;
    }
  }

  if (query.inStock !== undefined) {
    filter.stock = query.inStock ? { $gt: 0 } : 0;
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const skip = (query.page - 1) * query.limit;
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate(productPopulate)
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    meta: getPagination(query.page, query.limit, total),
  };
};

export const getProductById = async (
  productId: string,
): Promise<ProductDocument> => {
  const product = await Product.findById(productId).populate(productPopulate);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (
  productId: string,
  input: UpdateProductInput,
  imageFiles: Express.Multer.File[] = [],
): Promise<ProductDocument> => {
  if (Object.keys(input).length === 0 && imageFiles.length === 0) {
    throw new AppError("At least one product field or image is required", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const nextSlug =
    input.slug || input.name ? buildSlug(input.name ?? product.name, input.slug) : undefined;
  const nextSku = input.sku?.toUpperCase();

  await ensureUniqueFields(
    {
      slug: nextSlug !== product.slug ? nextSlug : undefined,
      sku: nextSku !== product.sku ? nextSku : undefined,
    },
    productId,
  );

  if (input.category) {
    await ensureActiveCategory(input.category);
  }

  if (
    input.discountPrice !== undefined &&
    input.price === undefined &&
    input.discountPrice > product.price
  ) {
    throw new AppError("Discount price cannot be greater than price", 400);
  }

  if (
    input.price !== undefined &&
    product.discountPrice !== undefined &&
    input.discountPrice === undefined &&
    product.discountPrice > input.price
  ) {
    throw new AppError("Discount price cannot be greater than price", 400);
  }

  const previousPublicIds = product.images.map((image) => image.publicId);

  if (input.name !== undefined) {
    product.name = input.name;
  }

  if (nextSlug) {
    product.slug = nextSlug;
  }

  if (input.description !== undefined) {
    product.description = input.description;
  }

  if (input.category !== undefined) {
    product.category = new Types.ObjectId(input.category);
  }

  if (input.brand !== undefined) {
    product.brand = input.brand;
  }

  if (input.price !== undefined) {
    product.price = input.price;
  }

  if (input.discountPrice !== undefined) {
    product.discountPrice = input.discountPrice;
  }

  if (input.stock !== undefined) {
    product.stock = input.stock;
  }

  if (nextSku) {
    product.sku = nextSku;
  }

  if (input.isFeatured !== undefined) {
    product.isFeatured = input.isFeatured;
  }

  if (input.isActive !== undefined) {
    product.isActive = input.isActive;
  }

  if (input.seo !== undefined) {
    product.seo = input.seo;
  }

  if (imageFiles.length > 0) {
    product.images = await uploadProductImages(imageFiles);
  }

  await product.save();

  if (imageFiles.length > 0) {
    await deleteProductImages(previousPublicIds);
  }

  return product.populate(productPopulate);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const publicIds = product.images.map((image) => image.publicId);
  await product.deleteOne();
  await deleteProductImages(publicIds);
};
