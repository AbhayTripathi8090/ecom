import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (error) {
      next(error);
    }
  };
