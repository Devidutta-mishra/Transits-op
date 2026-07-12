import { pool } from "../database/pool.js";
import { AppError } from "../utils/appError.js";
import { buildPagedResult } from "../utils/query.js";
import { DriverRepository } from "../repositories/driver.repository.js";
import { VehicleRepository } from "../repositories/vehicle.repository.js";

const driverRepository = new DriverRepository();
const vehicleRepository = new VehicleRepository();

function mapDriverStatus(status) {
  return String(status || "available").trim().toUpperCase();
}

export class DriverService {
  async createDriver(payload) {
    const duplicateEmployee = await driverRepository.findByEmployeeId(payload.employeeId);

    if (duplicateEmployee) {
      throw new AppError("Driver employee ID already exists", 409);
    }

    const duplicateLicense = await driverRepository.findByLicenseNumber(payload.licenseNumber);

    if (duplicateLicense) {
      throw new AppError("Driver license number already exists", 409);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (payload.assignedVehicleId) {
        const vehicle = await vehicleRepository.findById(payload.assignedVehicleId, client);

        if (!vehicle) {
          throw new AppError("Assigned vehicle not found", 404);
        }
      }

      const driver = await driverRepository.create(client, {
        ...payload,
        status: mapDriverStatus(payload.status)
      });

      if (payload.assignedVehicleId) {
        await vehicleRepository.update(
          payload.assignedVehicleId,
          { assignedDriverId: driver.id, status: "ASSIGNED" },
          client
        );
      }

      await client.query("COMMIT");
      return driver;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listDrivers(queryParams) {
    const result = await driverRepository.list(queryParams);
    return buildPagedResult(result.items, result.total, result.page, result.limit);
  }

  async getDriverById(id) {
    const driver = await driverRepository.findById(id);

    if (!driver) {
      throw new AppError("Driver not found", 404);
    }

    return driver;
  }

  async updateDriver(id, payload) {
    const existingDriver = await driverRepository.findById(id);

    if (!existingDriver) {
      throw new AppError("Driver not found", 404);
    }

    const updatedDriver = await driverRepository.update(id, {
      ...payload,
      status: payload.status ? mapDriverStatus(payload.status) : undefined
    });

    return updatedDriver;
  }

  async deleteDriver(id) {
    const existingDriver = await driverRepository.findById(id);

    if (!existingDriver) {
      throw new AppError("Driver not found", 404);
    }

    if (existingDriver.assignedVehicle?.id) {
      throw new AppError("Driver cannot be deleted while assigned to a vehicle", 409);
    }

    await driverRepository.remove(id);
    return null;
  }

  async assignVehicle(driverId, vehicleId) {
    const driver = await driverRepository.findById(driverId);
    const vehicle = await vehicleRepository.findById(vehicleId);

    if (!driver) {
      throw new AppError("Driver not found", 404);
    }

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await driverRepository.update(
        driverId,
        { assignedVehicleId: vehicleId, status: "ASSIGNED" },
        client
      );

      await vehicleRepository.update(
        vehicleId,
        { assignedDriverId: driverId, status: "ASSIGNED" },
        client
      );

      await client.query("COMMIT");
      return driverRepository.findById(driverId);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getDriverPerformance(id) {
    const performance = await driverRepository.getPerformance(id);

    if (!performance) {
      throw new AppError("Driver not found", 404);
    }

    return performance;
  }
}

export const driverService = new DriverService();
