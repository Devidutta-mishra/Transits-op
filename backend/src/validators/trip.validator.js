import { body, param, query } from "express-validator";

export const tripListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Sort order must be asc or desc"),
  query("status").optional().isIn(["scheduled", "assigned", "started", "in_progress", "completed", "cancelled"]).withMessage("Invalid trip status")
];

export const createTripValidator = [
  body("tripNumber").trim().notEmpty().withMessage("Trip number is required"),
  body("origin").trim().notEmpty().withMessage("Origin is required"),
  body("destination").trim().notEmpty().withMessage("Destination is required"),
  body("scheduledStart").isISO8601().withMessage("Scheduled start must be a valid date"),
  body("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle ID must be valid"),
  body("driverId").optional().isInt({ min: 1 }).withMessage("Driver ID must be valid"),
  body("estimatedArrival").optional().isISO8601().withMessage("Estimated arrival must be a valid date"),
  body("routeDistance").optional().isFloat({ min: 0 }).withMessage("Route distance must be positive"),
  body("status").optional().isIn(["scheduled", "assigned", "started", "in_progress", "completed", "cancelled"]).withMessage("Invalid trip status")
];

export const updateTripValidator = [
  param("id").isInt({ min: 1 }).withMessage("Trip ID must be valid"),
  body("scheduledStart").optional().isISO8601().withMessage("Scheduled start must be a valid date"),
  body("estimatedArrival").optional().isISO8601().withMessage("Estimated arrival must be a valid date"),
  body("actualStart").optional().isISO8601().withMessage("Actual start must be a valid date"),
  body("actualArrival").optional().isISO8601().withMessage("Actual arrival must be a valid date"),
  body("routeDistance").optional().isFloat({ min: 0 }).withMessage("Route distance must be positive")
];

export const tripIdParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Trip ID must be valid")
];

export const updateTripStatusValidator = [
  param("id").isInt({ min: 1 }).withMessage("Trip ID must be valid"),
  body("status").isIn(["scheduled", "assigned", "started", "in_progress", "completed", "cancelled"]).withMessage("Invalid trip status")
];

export const assignDriverToTripValidator = [
  param("id").isInt({ min: 1 }).withMessage("Trip ID must be valid"),
  body("driverId").isInt({ min: 1 }).withMessage("Driver ID must be valid")
];

export const assignVehicleToTripValidator = [
  param("id").isInt({ min: 1 }).withMessage("Trip ID must be valid"),
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle ID must be valid")
];
