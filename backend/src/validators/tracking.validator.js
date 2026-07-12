import { body, param } from "express-validator";

export const createTrackingValidator = [
  body("tripId").isInt({ min: 1 }).withMessage("Trip ID must be valid"),
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle ID must be valid"),
  body("driverId").isInt({ min: 1 }).withMessage("Driver ID must be valid"),
  body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Latitude must be valid"),
  body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Longitude must be valid"),
  body("speed").optional().isFloat({ min: 0 }).withMessage("Speed must be a positive number"),
  body("heading").optional().isFloat({ min: 0, max: 360 }).withMessage("Heading must be between 0 and 360"),
  body("timestamp").optional().isISO8601().withMessage("Timestamp must be a valid date")
];

export const trackingTripIdValidator = [
  param("tripId").isInt({ min: 1 }).withMessage("Trip ID must be valid")
];
