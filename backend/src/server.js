import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectPrisma,
  disconnectPrisma
} from "./database/prisma.js";

async function startServer() {
  try {
    await connectPrisma();

    const server = app.listen(env.port, () => {
      console.log(`TransitOps backend server running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectPrisma();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Server startup failed");
    console.error(error);
    process.exit(1);
  }
}

void startServer();
