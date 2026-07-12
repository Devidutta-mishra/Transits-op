import app from "./app.js";
import { env } from "./config/env.js";
import "./database/pool.js";

app.listen(env.port, () => {
  console.log(`TransitOps backend server running on port ${env.port}`);
});
