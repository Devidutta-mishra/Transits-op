import { Router } from "express";

import {
  createVehicle,
  deleteVehicle,
  getAvailableVehicles,
  getMaintenanceDueVehicles,
  getVehicleById,
  getVehicleDashboardSummary,
  getVehicles,
  updateVehicle
} from "../controllers/vehicle.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createVehicleValidator,
  updateVehicleValidator,
  vehicleIdParamValidator,
  vehicleListValidator
} from "../validators/vehicle.validator.js";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/vehicles:
 *   post:
 *     summary: Create a vehicle
 *   get:
 *     summary: List vehicles
 */
router.post(
  "/",
  authorizeRoles("Admin", "Fleet Manager"),
  createVehicleValidator,
  validateRequest,
  asyncHandler(createVehicle)
);
router.get("/", vehicleListValidator, validateRequest, asyncHandler(getVehicles));

/**
 * @openapi
 * /api/v1/vehicles/available:
 *   get:
 *     summary: List available vehicles
 */
router.get("/available", asyncHandler(getAvailableVehicles));

/**
 * @openapi
 * /api/v1/vehicles/maintenance-due:
 *   get:
 *     summary: List vehicles due for maintenance
 */
router.get("/maintenance-due", asyncHandler(getMaintenanceDueVehicles));

/**
 * @openapi
 * /api/v1/vehicles/dashboard-summary:
 *   get:
 *     summary: Get vehicle dashboard summary
 */
router.get("/dashboard-summary", asyncHandler(getVehicleDashboardSummary));

/**
 * @openapi
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by id
 *   patch:
 *     summary: Update vehicle
 *   delete:
 *     summary: Delete vehicle
 */
router.get("/:id", vehicleIdParamValidator, validateRequest, asyncHandler(getVehicleById));
router.patch(
  "/:id",
  authorizeRoles("Admin", "Fleet Manager"),
  updateVehicleValidator,
  validateRequest,
  asyncHandler(updateVehicle)
);
router.delete(
  "/:id",
  authorizeRoles("Admin", "Fleet Manager"),
  vehicleIdParamValidator,
  validateRequest,
  asyncHandler(deleteVehicle)
);

export default router;
