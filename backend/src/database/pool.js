import pg from "pg";

import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl || undefined
});

export async function query(text, params = []) {
  return pool.query(text, params);
}
