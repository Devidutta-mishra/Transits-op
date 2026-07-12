import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectPrisma,
  disconnectPrisma
} from "./database/prisma.js";

async function startServer() {
  let server;

  try {
    try {
      await connectPrisma();
    } catch (error) {
      if (env.nodeEnv !== "production") {
        console.error(
          "Starting server in degraded mode because the database is temporarily unavailable."
        );
        console.error(
          "API routes that need PostgreSQL may fail until Neon becomes reachable."
        );
      } else {
        throw error;
      }
    }

    server = app.listen(env.port, () => {
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
    if (server) {
      server.close();
    }
    process.exit(1);
  }
}

void startServer();
