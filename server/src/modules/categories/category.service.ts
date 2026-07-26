import { Types } from "mongoose";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { getPagination, type PaginationMeta } from "../../utils/pagination";
import { slugify } from "../../utils/slugify";
import { Product } from "../products/product.model";
import { Category } from "./category.model";
import type { CategoryDocument } from "./category.types";
import type {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

const categoryFolder = `${env.CLOUDINARY_FOLDER}/categories`;

const buildSlug = (name: string, slug?: string): string => slugify(slug ?? name);

const ensureUniqueSlug = async (
  slug: string,
  ignoreCategoryId?: string,
): Promise<void> => {
  const existingCategory = await Category.exists({
    slug,
    ...(ignoreCategoryId ? { _id: { $ne: ignoreCategoryId } } : {}),
  });

  if (existingCategory) {
    throw new AppError("Category slug already exists", 409);
  }
};

const ensureParentCategory = async (
  parentCategoryId?: string,
  currentCategoryId?: string,
): Promise<void> => {
  if (!parentCategoryId) {
    return;
  }

  if (parentCategoryId === currentCategoryId) {
    throw new AppError("Category cannot be its own parent", 400);
  }

  const parentCategory = await Category.exists({
    _id: parentCategoryId,
    isActive: true,
  });

  if (!parentCategory) {
    throw new AppError("Parent category not found", 404);
  }
};

export const createCategory = async (
  input: CreateCategoryInput,
  imageFile?: Express.Multer.File,
): Promise<CategoryDocument> => {
  const slug = buildSlug(input.name, input.slug);

  await ensureUniqueSlug(slug);
  await ensureParentCategory(input.parentCategory);

  const image = imageFile
    ? await uploadImage(imageFile.buffer, categoryFolder)
    : undefined;

  return Category.create({
    ...input,
    slug,
    image,
  });
};

export const getCategories = async (
  query: CategoryQueryInput,
): Promise<{ categories: CategoryDocument[]; meta: PaginationMeta }> => {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.parentCategory) {
    filter.parentCategory = query.parentCategory;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const skip = (query.page - 1) * query.limit;
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .populate("parentCategory", "name slug")
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit),
    Category.countDocuments(filter),
  ]);

  return {
    categories,
    meta: getPagination(query.page, query.limit, total),
  };
};

export const getCategoryById = async (
  categoryId: string,
): Promise<CategoryDocument> => {
  const category = await Category.findById(categoryId).populate(
    "parentCategory",
    "name slug",
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  input: UpdateCategoryInput,
  imageFile?: Express.Multer.File,
): Promise<CategoryDocument> => {
  if (Object.keys(input).length === 0 && !imageFile) {
    throw new AppError("At least one category field or image is required", 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const nextSlug =
    input.slug || input.name ? buildSlug(input.name ?? category.name, input.slug) : undefined;

  if (nextSlug && nextSlug !== category.slug) {
    await ensureUniqueSlug(nextSlug, categoryId);
    category.slug = nextSlug;
  }

  await ensureParentCategory(input.parentCategory, categoryId);

  const previousPublicId = category.image?.publicId;

  if (input.name !== undefined) {
    category.name = input.name;
  }

  if (input.description !== undefined) {
    category.description = input.description;
  }

  if (input.parentCategory !== undefined) {
    category.parentCategory = new Types.ObjectId(input.parentCategory);
  }

  if (input.isActive !== undefined) {
    category.isActive = input.isActive;
  }

  if (imageFile) {
    category.image = await uploadImage(imageFile.buffer, categoryFolder);
  }

  await category.save();

  if (imageFile && previousPublicId) {
    await deleteImage(previousPublicId);
  }

  return category.populate("parentCategory", "name slug");
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const childCategory = await Category.exists({ parentCategory: categoryId });

  if (childCategory) {
    throw new AppError("Cannot delete category with child categories", 400);
  }

  const productInCategory = await Product.exists({ category: categoryId });

  if (productInCategory) {
    throw new AppError("Cannot delete category with products", 400);
  }

  const previousPublicId = category.image?.publicId;
  await category.deleteOne();

  if (previousPublicId) {
    await deleteImage(previousPublicId);
  }
};
