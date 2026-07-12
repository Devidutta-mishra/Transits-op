import { Router } from "express";

import {
  getDashboardOverview,
  getFleetHealth,
  getLiveMap
} from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles("Admin", "Fleet Manager", "Dispatcher"));

/**
 * @openapi
 * /api/v1/dashboard/overview:
 *   get:
 *     summary: Get dashboard overview
 */
router.get("/overview", asyncHandler(getDashboardOverview));

/**
 * @openapi
 * /api/v1/dashboard/fleet-health:
 *   get:
 *     summary: Get fleet health metrics
 */
router.get("/fleet-health", asyncHandler(getFleetHealth));

/**
 * @openapi
 * /api/v1/dashboard/live-map:
 *   get:
 *     summary: Get live map data
 */
router.get("/live-map", asyncHandler(getLiveMap));

export default router;
