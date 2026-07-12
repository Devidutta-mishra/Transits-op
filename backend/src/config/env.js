import dotenv from "dotenv";

dotenv.config();

function appendSearchParam(params, key, value) {
  if (!params.has(key)) {
    params.set(key, value);
  }
}

function normalizeDatabaseUrl(value) {
  const databaseUrl = requireEnv("DATABASE_URL", value);

  try {
    const parsedUrl = new URL(databaseUrl);
    const isNeonPoolerHost = parsedUrl.hostname.includes("-pooler.");

    if (parsedUrl.protocol.startsWith("postgres") && isNeonPoolerHost) {
      appendSearchParam(parsedUrl.searchParams, "pgbouncer", "true");
      appendSearchParam(parsedUrl.searchParams, "connection_limit", "1");
      appendSearchParam(parsedUrl.searchParams, "pool_timeout", "20");
      appendSearchParam(parsedUrl.searchParams, "connect_timeout", "15");

      return parsedUrl.toString();
    }
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }

  return databaseUrl;
}

function requireEnv(name, value) {
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

process.env.DATABASE_URL = databaseUrl;

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl,
  jwtSecret: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || true,
  nodeEnv: process.env.NODE_ENV || "development"
};
