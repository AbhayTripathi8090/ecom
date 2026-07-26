import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 422;
    message = "Validation failed";
    errors = error.flatten();
  } else if (error?.name === "MongoServerError" && error?.code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
  } else if (error?.name === "ValidationError") {
    statusCode = 422;
    message = error.message;
  } else if (error?.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  } else if (error?.name === "MulterError") {
    statusCode = 400;
    message = error.message;
  } else if (error?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  } else if (error?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (env.NODE_ENV === "development" && error instanceof Error) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
