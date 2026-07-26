import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { productQuerySchema } from "./product.validation";

const getUploadedFiles = (files: Request["files"]): Express.Multer.File[] => {
  if (!files) {
    return [];
  }

  if (Array.isArray(files)) {
    return files;
  }

  return Object.values(files).flat();
};

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createProduct(req.body, getUploadedFiles(req.files));

  res.status(201).json({
    success: true,
    data: { product },
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getProducts(productQuerySchema.parse(req.query));

  res.status(200).json({
    success: true,
    data: {
      products: result.products,
      meta: result.meta,
    },
  });
});

export const findById = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductById(String(req.params.id));

  res.status(200).json({
    success: true,
    data: { product },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await updateProduct(
    String(req.params.id),
    req.body,
    getUploadedFiles(req.files),
  );

  res.status(200).json({
    success: true,
    data: { product },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteProduct(String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
