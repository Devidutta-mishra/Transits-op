import { successResponse } from "../utils/apiResponse.js";
import { driverService } from "../services/driver.service.js";

export async function createDriver(req, res) {
  const driver = await driverService.createDriver(req.body);
  return res.status(201).json(successResponse(driver, "Driver created successfully"));
}

export async function getDrivers(req, res) {
  const drivers = await driverService.listDrivers(req.query);
  return res.status(200).json(successResponse(drivers, "Drivers fetched successfully"));
}

export async function getDriverById(req, res) {
  const driver = await driverService.getDriverById(req.params.id);
  return res.status(200).json(successResponse(driver, "Driver fetched successfully"));
}

export async function updateDriver(req, res) {
  const driver = await driverService.updateDriver(req.params.id, req.body);
  return res.status(200).json(successResponse(driver, "Driver updated successfully"));
}

export async function deleteDriver(req, res) {
  await driverService.deleteDriver(req.params.id);
  return res.status(200).json(successResponse(null, "Driver deleted successfully"));
}

export async function assignVehicle(req, res) {
  const driver = await driverService.assignVehicle(
    req.params.id,
    req.body.vehicleId
  );
  return res.status(200).json(successResponse(driver, "Vehicle assigned successfully"));
}

export async function getDriverPerformance(req, res) {
  const performance = await driverService.getDriverPerformance(req.params.id);
  return res.status(200).json(successResponse(performance, "Driver performance fetched successfully"));
}
