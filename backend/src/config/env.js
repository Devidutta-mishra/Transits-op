import dotenv from "dotenv";

dotenv.config();

function requireEnv(name, value) {
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: requireEnv("DATABASE_URL", process.env.DATABASE_URL),
  jwtSecret: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || true,
  nodeEnv: process.env.NODE_ENV || "development"
};
