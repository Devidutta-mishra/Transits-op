import { successResponse } from "../utils/apiResponse.js";
import { trackingService } from "../services/tracking.service.js";

export async function addTrackingLocation(req, res) {
  const location = await trackingService.addLocation(req.body, req.user);
  return res.status(201).json(successResponse(location, "Tracking location saved successfully"));
}

export async function getTripTracking(req, res) {
  const history = await trackingService.getTripTracking(req.params.tripId, req.user);
  return res.status(200).json(successResponse(history, "Tracking history fetched successfully"));
}

export async function getLiveTracking(req, res) {
  const live = await trackingService.getLiveTracking();
  return res.status(200).json(successResponse(live, "Live tracking fetched successfully"));
}
