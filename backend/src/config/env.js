import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || true,
  nodeEnv: process.env.NODE_ENV || "development"
};
