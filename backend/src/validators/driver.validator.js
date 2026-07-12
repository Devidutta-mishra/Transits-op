import { body, param, query } from "express-validator";

export const driverListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Sort order must be asc or desc")
];

export const createDriverValidator = [
  body("userId").isInt({ min: 1 }).withMessage("User ID is required"),
  body("employeeId").trim().notEmpty().withMessage("Employee ID is required"),
  body("licenseNumber").trim().notEmpty().withMessage("License number is required"),
  body("licenseExpiry").isISO8601().withMessage("License expiry must be a valid date"),
  body("experience").optional().isFloat({ min: 0 }).withMessage("Experience must be a positive number"),
  body("assignedVehicleId").optional().isInt({ min: 1 }).withMessage("Assigned vehicle ID must be valid"),
  body("status").optional().isIn(["available", "assigned", "on_trip", "on_duty", "inactive", "off_duty", "suspended"]).withMessage("Invalid driver status"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5")
];

export const updateDriverValidator = [
  param("id").isInt({ min: 1 }).withMessage("Driver ID must be valid"),
  body("licenseExpiry").optional().isISO8601().withMessage("License expiry must be a valid date"),
  body("experience").optional().isFloat({ min: 0 }).withMessage("Experience must be a positive number"),
  body("assignedVehicleId").optional().isInt({ min: 1 }).withMessage("Assigned vehicle ID must be valid"),
  body("status").optional().isIn(["available", "assigned", "on_trip", "on_duty", "inactive", "off_duty", "suspended"]).withMessage("Invalid driver status"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5")
];

export const driverIdParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Driver ID must be valid")
];

export const assignVehicleValidator = [
  param("id").isInt({ min: 1 }).withMessage("Driver ID must be valid"),
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle ID must be valid")
];
