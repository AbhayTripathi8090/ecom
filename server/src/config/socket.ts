import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { verifyAuthToken } from "../utils/jwt";

import { env } from "../config/env";
import type { UserRole } from "../modules/auth/auth.types";
import type { NotificationType } from "../modules/notification/notification.model";

interface SocketUser {
  id: string;
  role: UserRole;
}

interface AdminNotificationPayload {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId: string | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SocketData {
  user?: SocketUser;
}

type SocketServer = Server<
  {},
  { "admin:notification": (notification: AdminNotificationPayload) => void },
  {},
  SocketData
>;

let io: SocketServer | undefined;

export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
  const socketServer: SocketServer = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.includes("*") ? true : allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  socketServer.use((socket, next) => {
    const token: unknown = socket.handshake.auth?.token;

    if (typeof token !== "string" || token.length === 0) {
      next(new Error("Authentication required"));
      return;
    }

    try {
      const decoded = verifyAuthToken(token);
      if (
        typeof decoded.userId !== "string" ||
        (decoded.role !== "user" && decoded.role !== "admin")
      ) {
        next(new Error("Invalid or expired token"));
        return;
      }

      socket.data.user = {
        id: decoded.userId,
        role: decoded.role,
      };
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  socketServer.on("connection", (socket) => {
    const user = socket.data.user;
    if (!user) {
      socket.disconnect(true);
      return;
    }

    if (user.role === "admin") {
      socket.join("admins");
    }

    console.log(`Socket connected: ${socket.id} (user ${user.id})`);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  io = socketServer;
  return socketServer;
};

export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};