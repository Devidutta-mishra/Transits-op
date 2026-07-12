import { successResponse } from "../utils/apiResponse.js";
import { vehicleService } from "../services/vehicle.service.js";

export async function createVehicle(req, res) {
  const vehicle = await vehicleService.createVehicle(req.body, req.user);
  return res.status(201).json(successResponse(vehicle, "Vehicle created successfully"));
}

export async function getVehicles(req, res) {
  const vehicles = await vehicleService.listVehicles(req.query);
  return res.status(200).json(successResponse(vehicles, "Vehicles fetched successfully"));
}

export async function getVehicleById(req, res) {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  return res.status(200).json(successResponse(vehicle, "Vehicle fetched successfully"));
}

export async function updateVehicle(req, res) {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  return res.status(200).json(successResponse(vehicle, "Vehicle updated successfully"));
}

export async function deleteVehicle(req, res) {
  await vehicleService.deleteVehicle(req.params.id);
  return res.status(200).json(successResponse(null, "Vehicle deleted successfully"));
}

export async function getAvailableVehicles(req, res) {
  const vehicles = await vehicleService.getAvailableVehicles();
  return res.status(200).json(successResponse(vehicles, "Available vehicles fetched successfully"));
}

export async function getMaintenanceDueVehicles(req, res) {
  const vehicles = await vehicleService.getMaintenanceDueVehicles();
  return res.status(200).json(successResponse(vehicles, "Maintenance due vehicles fetched successfully"));
}

export async function getVehicleDashboardSummary(req, res) {
  const summary = await vehicleService.getVehicleDashboardSummary();
  return res.status(200).json(successResponse(summary, "Vehicle dashboard summary fetched successfully"));
}
