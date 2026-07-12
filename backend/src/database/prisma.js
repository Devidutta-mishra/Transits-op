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

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectPrisma({ retries = 3, retryDelayMs = 1500 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = "connected";
      console.log("✓ Connected to Neon PostgreSQL");
      return true;
    } catch (error) {
      lastError = error;
      databaseStatus = "disconnected";
      console.error(
        `Failed to connect to Neon PostgreSQL (attempt ${attempt}/${retries})`
      );
      console.error(error);

      if (attempt < retries) {
        await wait(retryDelayMs);
      }
    }
  }

  throw lastError;
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
