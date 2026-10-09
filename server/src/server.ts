import { createServer } from "node:http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initializeSocket } from "./config/socket";

const startServer = async () => {
  await connectDB();

  const httpServer = createServer(app);
  initializeSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on ${env.PORT}`);
  });
};

void startServer();
