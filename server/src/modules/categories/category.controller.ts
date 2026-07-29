import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.service";


export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await createCategory(req.body, req.file);

  res.status(201).json({
    success: true,
    data: { category },
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getCategories(req.query as any);

  res.status(200).json({
    success: true,
    data: {
      categories: result.categories,
      meta: result.meta,
    },
  });
});

export const findById = asyncHandler(async (req: Request, res: Response) => {
  const category = await getCategoryById(String(req.params.id));

  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await updateCategory(String(req.params.id), req.body, req.file);

  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteCategory(String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
