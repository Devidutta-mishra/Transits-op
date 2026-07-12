import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
