import { Router } from "express";

import {
  assignDriverToTrip,
  assignVehicleToTrip,
  createTrip,
  getTripById,
  getTrips,
  updateTrip,
  updateTripStatus
} from "../controllers/trip.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignDriverToTripValidator,
  assignVehicleToTripValidator,
  createTripValidator,
  tripIdParamValidator,
  tripListValidator,
  updateTripStatusValidator,
  updateTripValidator
} from "../validators/trip.validator.js";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/trips:
 *   post:
 *     summary: Create a trip
 *   get:
 *     summary: List trips
 */
router.post(
  "/",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  createTripValidator,
  validateRequest,
  asyncHandler(createTrip)
);
router.get("/", tripListValidator, validateRequest, asyncHandler(getTrips));

/**
 * @openapi
 * /api/v1/trips/{id}/status:
 *   patch:
 *     summary: Update trip status
 */
router.patch(
  "/:id/status",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  updateTripStatusValidator,
  validateRequest,
  asyncHandler(updateTripStatus)
);

/**
 * @openapi
 * /api/v1/trips/{id}/assign-driver:
 *   post:
 *     summary: Assign driver to trip
 */
router.post(
  "/:id/assign-driver",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  assignDriverToTripValidator,
  validateRequest,
  asyncHandler(assignDriverToTrip)
);

/**
 * @openapi
 * /api/v1/trips/{id}/assign-vehicle:
 *   post:
 *     summary: Assign vehicle to trip
 */
router.post(
  "/:id/assign-vehicle",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  assignVehicleToTripValidator,
  validateRequest,
  asyncHandler(assignVehicleToTrip)
);

/**
 * @openapi
 * /api/v1/trips/{id}:
 *   get:
 *     summary: Get trip by id
 *   patch:
 *     summary: Update trip
 */
router.get("/:id", tripIdParamValidator, validateRequest, asyncHandler(getTripById));
router.patch(
  "/:id",
  authorizeRoles("Admin", "Fleet Manager", "Dispatcher"),
  updateTripValidator,
  validateRequest,
  asyncHandler(updateTrip)
);

export default router;
