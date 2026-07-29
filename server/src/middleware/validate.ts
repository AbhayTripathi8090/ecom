import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
    (req: Request, _res: Response, next: NextFunction): void => {
      try {
        const parsed = schema.parse(req[target]);
        Object.defineProperty(req, target, {
          value: parsed,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        next();
      } catch (error) {
        next(error);
      }
    };
