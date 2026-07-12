import { successResponse } from "../utils/apiResponse.js";
import { dashboardService } from "../services/dashboard.service.js";

export async function getDashboardOverview(req, res) {
  const overview = await dashboardService.getOverview();
  return res.status(200).json(successResponse(overview, "Dashboard overview fetched successfully"));
}

export async function getFleetHealth(req, res) {
  const fleetHealth = await dashboardService.getFleetHealth();
  return res.status(200).json(successResponse(fleetHealth, "Fleet health fetched successfully"));
}

export async function getLiveMap(req, res) {
  const liveMap = await dashboardService.getLiveMap();
  return res.status(200).json(successResponse(liveMap, "Live map fetched successfully"));
}
