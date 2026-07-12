import { Router } from "express";

import {
  getDriverDashboard,
  getDashboardOverview,
  getFleetHealth,
  getLiveMap
} from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/dashboard/driver:
 *   get:
 *     summary: Load the authenticated driver's dashboard
 *     description: Returns the aggregated driver, vehicle, trip, stats, notifications, quick actions, and vehicle health data required by the Android driver home screen.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.get(
  "/driver",
  authorizeRoles("Driver"),
  asyncHandler(getDriverDashboard)
);

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
