import { body, param, query } from "express-validator";

export const vehicleListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("status").optional().isIn(["available", "assigned", "in_transit", "maintenance", "inactive"]).withMessage("Invalid vehicle status"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Sort order must be asc or desc")
];

export const createVehicleValidator = [
  body("registrationNumber").trim().notEmpty().withMessage("Registration number is required"),
  body("chassisNumber").trim().notEmpty().withMessage("Chassis number is required"),
  body("vehicleType").trim().notEmpty().withMessage("Vehicle type is required"),
  body("manufacturer").trim().notEmpty().withMessage("Manufacturer is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("year").isInt({ min: 1900, max: 3000 }).withMessage("Year must be valid"),
  body("fuelType").trim().notEmpty().withMessage("Fuel type is required"),
  body("capacity").isFloat({ min: 0 }).withMessage("Capacity must be a positive number"),
  body("mileage").optional().isFloat({ min: 0 }).withMessage("Mileage must be a positive number"),
  body("currentOdometer").optional().isFloat({ min: 0 }).withMessage("Current odometer must be a positive number"),
  body("currentFuelLevel").optional().isFloat({ min: 0, max: 100 }).withMessage("Current fuel level must be between 0 and 100"),
  body("status").optional().isIn(["available", "assigned", "in_transit", "maintenance", "inactive"]).withMessage("Invalid vehicle status"),
  body("insuranceExpiry").optional().isISO8601().withMessage("Insurance expiry must be a valid date"),
  body("pollutionExpiry").optional().isISO8601().withMessage("Pollution expiry must be a valid date"),
  body("fitnessExpiry").optional().isISO8601().withMessage("Fitness expiry must be a valid date"),
  body("serviceDueDate").optional().isISO8601().withMessage("Service due date must be a valid date"),
  body("lastServiceDate").optional().isISO8601().withMessage("Last service date must be a valid date"),
  body("currentLocation.latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude must be valid"),
  body("currentLocation.longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude must be valid")
];

export const updateVehicleValidator = [
  param("id").isInt({ min: 1 }).withMessage("Vehicle ID must be valid"),
  body("year").optional().isInt({ min: 1900, max: 3000 }).withMessage("Year must be valid"),
  body("capacity").optional().isFloat({ min: 0 }).withMessage("Capacity must be a positive number"),
  body("mileage").optional().isFloat({ min: 0 }).withMessage("Mileage must be a positive number"),
  body("currentOdometer").optional().isFloat({ min: 0 }).withMessage("Current odometer must be a positive number"),
  body("currentFuelLevel").optional().isFloat({ min: 0, max: 100 }).withMessage("Current fuel level must be between 0 and 100"),
  body("status").optional().isIn(["available", "assigned", "in_transit", "maintenance", "inactive"]).withMessage("Invalid vehicle status")
];

export const vehicleIdParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Vehicle ID must be valid")
];
