import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "response" in error) {
    const err = error as any;
    const data = err.response?.data;
    if (data) {
      if (data.message && data.errors?.fieldErrors) {
        const fieldErrors = data.errors.fieldErrors;
        const fieldDetails = Object.entries(fieldErrors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("; ");
        if (fieldDetails) {
          return `${data.message} (${fieldDetails})`;
        }
      }
      if (data.message) return data.message;
    }
    if (err.message) return err.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
