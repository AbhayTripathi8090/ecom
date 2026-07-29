export type UserRole = "user" | "admin";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";
