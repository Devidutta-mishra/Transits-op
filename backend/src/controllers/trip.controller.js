import { successResponse } from "../utils/apiResponse.js";
import { tripService } from "../services/trip.service.js";

export async function createTrip(req, res) {
  const trip = await tripService.createTrip(req.body, req.user);
  return res.status(201).json(successResponse(trip, "Trip created successfully"));
}

export async function getTrips(req, res) {
  const trips = await tripService.listTrips(req.query, req.user);
  return res.status(200).json(successResponse(trips, "Trips fetched successfully"));
}

export async function getTripById(req, res) {
  const trip = await tripService.getTripById(req.params.id, req.user);
  return res.status(200).json(successResponse(trip, "Trip fetched successfully"));
}

export async function updateTrip(req, res) {
  const trip = await tripService.updateTrip(req.params.id, req.body);
  return res.status(200).json(successResponse(trip, "Trip updated successfully"));
}

export async function updateTripStatus(req, res) {
  const trip = await tripService.updateTripStatus(req.params.id, req.body.status);
  return res.status(200).json(successResponse(trip, "Trip status updated successfully"));
}

export async function assignDriverToTrip(req, res) {
  const trip = await tripService.assignDriver(req.params.id, req.body.driverId);
  return res.status(200).json(successResponse(trip, "Driver assigned to trip successfully"));
}

export async function assignVehicleToTrip(req, res) {
  const trip = await tripService.assignVehicle(req.params.id, req.body.vehicleId);
  return res.status(200).json(successResponse(trip, "Vehicle assigned to trip successfully"));
}
