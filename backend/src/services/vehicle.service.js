import { pool } from "../database/pool.js";
import { AppError } from "../utils/appError.js";
import { buildPagedResult } from "../utils/query.js";
import { DriverRepository } from "../repositories/driver.repository.js";
import { VehicleRepository } from "../repositories/vehicle.repository.js";

const vehicleRepository = new VehicleRepository();
const driverRepository = new DriverRepository();

const MUTATION_ROLES = ["Admin", "Fleet Manager"];

function mapVehicleStatus(status) {
  return String(status || "available").trim().toUpperCase();
}

export class VehicleService {
  async createVehicle(payload, user) {
    const existingVehicle = await vehicleRepository.findByRegistrationNumber(
      payload.registrationNumber
    );

    if (existingVehicle) {
      throw new AppError("Vehicle with this registration number already exists", 409);
    }

    if (payload.assignedDriverId) {
      const driver = await driverRepository.findById(payload.assignedDriverId);

      if (!driver) {
        throw new AppError("Assigned driver not found", 404);
      }
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const vehicle = await vehicleRepository.create(client, {
        ...payload,
        name: `${payload.manufacturer || "Vehicle"} ${payload.model || payload.registrationNumber}`.trim(),
        status: mapVehicleStatus(payload.status),
        createdBy: user.sub
      });

      if (payload.assignedDriverId) {
        await driverRepository.update(
          payload.assignedDriverId,
          { assignedVehicleId: vehicle.id, status: "ASSIGNED" },
          client
        );
      }

      await client.query("COMMIT");
      return vehicle;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listVehicles(queryParams) {
    const result = await vehicleRepository.list(queryParams);
    return buildPagedResult(result.items, result.total, result.page, result.limit);
  }

  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    return vehicle;
  }

  async updateVehicle(id, payload) {
    const existingVehicle = await vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    if (payload.registrationNumber) {
      const duplicateVehicle = await vehicleRepository.findByRegistrationNumber(
        payload.registrationNumber
      );

      if (duplicateVehicle && duplicateVehicle.id !== Number(id)) {
        throw new AppError("Vehicle with this registration number already exists", 409);
      }
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updatedVehicle = await vehicleRepository.update(
        id,
        {
          ...payload,
          status: payload.status ? mapVehicleStatus(payload.status) : undefined
        },
        client
      );

      if (payload.assignedDriverId !== undefined) {
        if (payload.assignedDriverId) {
          await driverRepository.update(
            payload.assignedDriverId,
            { assignedVehicleId: Number(id), status: "ASSIGNED" },
            client
          );
        }
      }

      await client.query("COMMIT");
      return updatedVehicle;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteVehicle(id) {
    const existingVehicle = await vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    if (existingVehicle.currentTrip?.id) {
      throw new AppError("Vehicle cannot be deleted while assigned to a trip", 409);
    }

    await vehicleRepository.remove(id);
    return null;
  }

  async getAvailableVehicles() {
    return vehicleRepository.listAvailable();
  }

  async getMaintenanceDueVehicles() {
    return vehicleRepository.listMaintenanceDue();
  }

  async getVehicleDashboardSummary() {
    return vehicleRepository.getDashboardSummary();
  }
}

export const vehicleService = new VehicleService();
export { MUTATION_ROLES as vehicleMutationRoles };
