import { Router } from "express";

import {
  addTrackingLocation,
  getLiveTracking,
  getTripTracking
} from "../controllers/tracking.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createTrackingValidator,
  trackingTripIdValidator
} from "../validators/tracking.validator.js";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/tracking/location:
 *   post:
 *     summary: Save a tracking location
 */
router.post(
  "/location",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher", "Driver"),
  createTrackingValidator,
  validateRequest,
  asyncHandler(addTrackingLocation)
);

/**
 * @openapi
 * /api/v1/tracking/live:
 *   get:
 *     summary: Get live vehicle tracking data
 */
router.get(
  "/live",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  asyncHandler(getLiveTracking)
);

/**
 * @openapi
 * /api/v1/tracking/{tripId}:
 *   get:
 *     summary: Get trip tracking history
 */
router.get(
  "/:tripId",
  trackingTripIdValidator,
  validateRequest,
  asyncHandler(getTripTracking)
);

export default router;
