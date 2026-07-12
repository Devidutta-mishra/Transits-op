import { PrismaClient } from "@prisma/client";

import { env } from "../config/env.js";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.nodeEnv === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"]
  });

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

let databaseStatus = "disconnected";

export async function connectPrisma() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
    console.log("✓ Connected to Neon PostgreSQL");
  } catch (error) {
    databaseStatus = "disconnected";
    console.error("Failed to connect to Neon PostgreSQL");
    console.error(error);
    throw error;
  }
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  databaseStatus = "disconnected";
}

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
    return databaseStatus;
  } catch {
    databaseStatus = "disconnected";
    return databaseStatus;
  }
}

export function getDatabaseStatus() {
  return databaseStatus;
}
