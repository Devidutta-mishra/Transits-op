import { pool } from "../database/pool.js";
import { AppError } from "../utils/appError.js";
import { buildPagedResult } from "../utils/query.js";
import { DriverRepository } from "../repositories/driver.repository.js";
import { TripRepository } from "../repositories/trip.repository.js";
import { VehicleRepository } from "../repositories/vehicle.repository.js";

const tripRepository = new TripRepository();
const vehicleRepository = new VehicleRepository();
const driverRepository = new DriverRepository();

const ACTIVE_TRIP_STATUSES = ["scheduled", "assigned", "started", "in_progress"];

export class TripService {
  async createTrip(payload, user) {
    const duplicateTrip = await tripRepository.findByTripNumber(payload.tripNumber);

    if (duplicateTrip) {
      throw new AppError("Trip number already exists", 409);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (payload.vehicleId) {
        const vehicle = await vehicleRepository.findById(payload.vehicleId, client);

        if (!vehicle) {
          throw new AppError("Vehicle not found", 404);
        }

        if (["MAINTENANCE", "INACTIVE"].includes(String(vehicle.status || "").toUpperCase())) {
          throw new AppError("Vehicle is not available for trip assignment", 409);
        }

        const activeVehicleTrip = await tripRepository.findActiveByVehicleId(payload.vehicleId);

        if (activeVehicleTrip) {
          throw new AppError("Vehicle is already assigned to an active trip", 409);
        }
      }

      if (payload.driverId) {
        const driver = await driverRepository.findById(payload.driverId, client);

        if (!driver) {
          throw new AppError("Driver not found", 404);
        }

        if (["INACTIVE", "SUSPENDED"].includes(String(driver.status || "").toUpperCase())) {
          throw new AppError("Driver is not available for trip assignment", 409);
        }

        const activeDriverTrip = await tripRepository.findActiveByDriverId(payload.driverId);

        if (activeDriverTrip) {
          throw new AppError("Driver is already assigned to an active trip", 409);
        }
      }

      const trip = await tripRepository.create(client, {
        ...payload,
        status: payload.status || "scheduled",
        createdBy: user.userId
      });

      if (payload.vehicleId) {
        await vehicleRepository.update(
          payload.vehicleId,
          {
            currentTripId: trip.id,
            assignedDriverId: payload.driverId || undefined,
            status: "ASSIGNED"
          },
          client
        );
      }

      if (payload.driverId) {
        await driverRepository.update(
          payload.driverId,
          {
            assignedVehicleId: payload.vehicleId || undefined,
            status: "ASSIGNED"
          },
          client
        );
      }

      await client.query("COMMIT");
      return trip;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listTrips(queryParams, user) {
    const scope =
      String(user.role || "").toLowerCase() === "driver".toLowerCase()
        ? { driverUserId: user.userId }
        : {};
    const result = await tripRepository.list(queryParams, scope);

    return buildPagedResult(result.items, result.total, result.page, result.limit);
  }

  async getTripById(id, user) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    if (String(user.role || "").toLowerCase() === "driver") {
      const driver = await driverRepository.findByUserId(user.userId);

      if (!driver || trip.driver?.id !== driver.id) {
        throw new AppError("You are not authorized to view this trip", 403);
      }
    }

    return trip;
  }

  async updateTrip(id, payload) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return tripRepository.update(id, payload);
  }

  async updateTripStatus(id, status) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updates = { status };

      if (status === "started" && !trip.actualStart) {
        updates.actualStart = new Date().toISOString();
      }

      if (status === "completed" && !trip.actualArrival) {
        updates.actualArrival = new Date().toISOString();
      }

      const updatedTrip = await tripRepository.update(id, updates, client);

      if (trip.vehicle?.id) {
        await vehicleRepository.update(
          trip.vehicle.id,
          {
            status: status === "completed" || status === "cancelled" ? "AVAILABLE" : "IN_TRANSIT",
            currentTripId:
              status === "completed" || status === "cancelled" ? null : Number(id)
          },
          client
        );
      }

      if (trip.driver?.id) {
        await driverRepository.update(
          trip.driver.id,
          {
            status: status === "completed" || status === "cancelled" ? "AVAILABLE" : "ON_TRIP"
          },
          client
        );
      }

      await client.query("COMMIT");
      return updatedTrip;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async assignDriver(id, driverId) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const driver = await driverRepository.findById(driverId);

    if (!driver) {
      throw new AppError("Driver not found", 404);
    }

    if (["INACTIVE", "SUSPENDED"].includes(String(driver.status || "").toUpperCase())) {
      throw new AppError("Driver is not available for trip assignment", 409);
    }

    const activeTrip = await tripRepository.findActiveByDriverId(driverId);

    if (activeTrip && activeTrip.id !== Number(id)) {
      throw new AppError("Driver is already assigned to an active trip", 409);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updatedTrip = await tripRepository.update(
        id,
        { driverId, status: trip.status === "scheduled" ? "assigned" : trip.status },
        client
      );

      await driverRepository.update(
        driverId,
        {
          assignedVehicleId: trip.vehicle?.id || undefined,
          status: "ASSIGNED"
        },
        client
      );

      if (trip.vehicle?.id) {
        await vehicleRepository.update(
          trip.vehicle.id,
          { assignedDriverId: driverId, status: "ASSIGNED" },
          client
        );
      }

      await client.query("COMMIT");
      return updatedTrip;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async assignVehicle(id, vehicleId) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const vehicle = await vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    if (["MAINTENANCE", "INACTIVE"].includes(String(vehicle.status || "").toUpperCase())) {
      throw new AppError("Vehicle is not available for trip assignment", 409);
    }

    const activeTrip = await tripRepository.findActiveByVehicleId(vehicleId);

    if (activeTrip && activeTrip.id !== Number(id)) {
      throw new AppError("Vehicle is already assigned to an active trip", 409);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updatedTrip = await tripRepository.update(
        id,
        { vehicleId, status: trip.status === "scheduled" ? "assigned" : trip.status },
        client
      );

      await vehicleRepository.update(
        vehicleId,
        {
          currentTripId: id,
          assignedDriverId: trip.driver?.id || undefined,
          status: "ASSIGNED"
        },
        client
      );

      if (trip.driver?.id) {
        await driverRepository.update(
          trip.driver.id,
          { assignedVehicleId: vehicleId, status: "ASSIGNED" },
          client
        );
      }

      await client.query("COMMIT");
      return updatedTrip;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const tripService = new TripService();
