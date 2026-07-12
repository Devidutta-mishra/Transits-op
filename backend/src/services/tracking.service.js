import { pool } from "../database/pool.js";
import { AppError } from "../utils/appError.js";
import { DriverRepository } from "../repositories/driver.repository.js";
import { TrackingRepository } from "../repositories/tracking.repository.js";
import { TripRepository } from "../repositories/trip.repository.js";
import { VehicleRepository } from "../repositories/vehicle.repository.js";

const trackingRepository = new TrackingRepository();
const tripRepository = new TripRepository();
const vehicleRepository = new VehicleRepository();
const driverRepository = new DriverRepository();

export class TrackingService {
  async addLocation(payload, user) {
    const trip = await tripRepository.findById(payload.tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    if (String(user.role || "").toLowerCase() === "driver") {
      const driver = await driverRepository.findByUserId(user.userId);

      if (!driver || driver.id !== payload.driverId || trip.driver?.id !== driver.id) {
        throw new AppError("You can only update location for your assigned trip", 403);
      }
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const location = await trackingRepository.create(client, payload);

      await tripRepository.update(
        payload.tripId,
        {
          currentLocation: {
            latitude: payload.latitude,
            longitude: payload.longitude
          }
        },
        client
      );

      if (payload.vehicleId) {
        await vehicleRepository.update(
          payload.vehicleId,
          {
            currentLocation: {
              latitude: payload.latitude,
              longitude: payload.longitude
            },
            status: trip.status === "in_progress" || trip.status === "started" ? "IN_TRANSIT" : "ASSIGNED"
          },
          client
        );
      }

      await client.query("COMMIT");
      return location;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getTripTracking(tripId, user) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    if (String(user.role || "").toLowerCase() === "driver") {
      const driver = await driverRepository.findByUserId(user.userId);

      if (!driver || trip.driver?.id !== driver.id) {
        throw new AppError("You are not authorized to view this tracking data", 403);
      }
    }

    return trackingRepository.getByTripId(tripId);
  }

  async getLiveTracking() {
    return trackingRepository.getLive();
  }
}

export const trackingService = new TrackingService();
