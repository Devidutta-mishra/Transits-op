import { Router } from "express";

import {
  assignVehicle,
  createDriver,
  deleteDriver,
  getDriverById,
  getDriverPerformance,
  getDrivers,
  updateDriver
} from "../controllers/driver.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignVehicleValidator,
  createDriverValidator,
  driverIdParamValidator,
  driverListValidator,
  updateDriverValidator
} from "../validators/driver.validator.js";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/drivers:
 *   post:
 *     summary: Create a driver profile
 *   get:
 *     summary: List drivers
 */
router.post(
  "/",
  authorizeRoles("Admin", "Fleet Manager"),
  createDriverValidator,
  validateRequest,
  asyncHandler(createDriver)
);
router.get("/", driverListValidator, validateRequest, asyncHandler(getDrivers));

/**
 * @openapi
 * /api/v1/drivers/{id}/assign-vehicle:
 *   post:
 *     summary: Assign vehicle to driver
 */
router.post(
  "/:id/assign-vehicle",
  authorizeRoles("Admin", "Fleet Manager"),
  assignVehicleValidator,
  validateRequest,
  asyncHandler(assignVehicle)
);

/**
 * @openapi
 * /api/v1/drivers/{id}/performance:
 *   get:
 *     summary: Get driver performance metrics
 */
router.get(
  "/:id/performance",
  driverIdParamValidator,
  validateRequest,
  asyncHandler(getDriverPerformance)
);

/**
 * @openapi
 * /api/v1/drivers/{id}:
 *   get:
 *     summary: Get driver by id
 *   patch:
 *     summary: Update driver
 *   delete:
 *     summary: Delete driver
 */
router.get("/:id", driverIdParamValidator, validateRequest, asyncHandler(getDriverById));
router.patch(
  "/:id",
  authorizeRoles("Admin", "Fleet Manager"),
  updateDriverValidator,
  validateRequest,
  asyncHandler(updateDriver)
);
router.delete(
  "/:id",
  authorizeRoles("Admin", "Fleet Manager"),
  driverIdParamValidator,
  validateRequest,
  asyncHandler(deleteDriver)
);

export default router;
