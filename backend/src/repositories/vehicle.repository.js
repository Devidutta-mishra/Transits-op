import { query } from "../database/pool.js";
import { getPagination, getSortClause } from "../utils/query.js";

const VEHICLE_SORT_FIELDS = {
  createdAt: "v.created_at",
  registrationNumber: "v.registration_number",
  manufacturer: "v.manufacturer",
  model: "v.model",
  status: "v.status",
  currentOdometer: "v.current_odometer",
  serviceDueDate: "v.service_due_date"
};

function buildVehicleFilters(params, startIndex = 1) {
  const conditions = [];
  const values = [];
  let index = startIndex;

  if (params.search) {
    conditions.push(
      `(v.registration_number ILIKE $${index} OR v.chassis_number ILIKE $${index} OR v.manufacturer ILIKE $${index} OR v.model ILIKE $${index})`
    );
    values.push(`%${params.search}%`);
    index += 1;
  }

  if (params.status) {
    conditions.push(`LOWER(v.status::text) = LOWER($${index})`);
    values.push(params.status);
    index += 1;
  }

  if (params.vehicleType) {
    conditions.push(`LOWER(v.vehicle_type) = LOWER($${index})`);
    values.push(params.vehicleType);
    index += 1;
  }

  if (params.assignedDriverId) {
    conditions.push(`v.assigned_driver_id = $${index}`);
    values.push(params.assignedDriverId);
    index += 1;
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
    nextIndex: index
  };
}

function baseVehicleSelect() {
  return `
    SELECT
      v.id,
      v.registration_number AS "registrationNumber",
      v.chassis_number AS "chassisNumber",
      v.vehicle_type AS "vehicleType",
      v.manufacturer,
      v.model,
      v.year,
      v.fuel_type AS "fuelType",
      v.capacity_kg AS capacity,
      v.mileage,
      v.current_odometer AS "currentOdometer",
      v.current_fuel_level AS "currentFuelLevel",
      v.status::text AS status,
      v.insurance_expiry AS "insuranceExpiry",
      v.pollution_expiry AS "pollutionExpiry",
      v.fitness_expiry AS "fitnessExpiry",
      v.service_due_date AS "serviceDueDate",
      v.last_service_date AS "lastServiceDate",
      v.current_latitude AS "currentLatitude",
      v.current_longitude AS "currentLongitude",
      v.created_at AS "createdAt",
      v.updated_at AS "updatedAt",
      json_build_object(
        'id', d.id,
        'employeeId', d.employee_id,
        'licenseNumber', d.license_number,
        'status', d.status::text,
        'user', json_build_object(
          'id', u.id,
          'fullName', u.full_name,
          'email', u.email
        )
      ) AS "assignedDriver",
      json_build_object(
        'id', t.id,
        'tripNumber', t.trip_number,
        'status', t.status
      ) AS "currentTrip",
      json_build_object(
        'latitude', v.current_latitude,
        'longitude', v.current_longitude
      ) AS "currentLocation",
      json_build_object(
        'id', creator.id,
        'fullName', creator.full_name,
        'email', creator.email
      ) AS "createdBy"
    FROM vehicles v
    LEFT JOIN drivers d ON d.id = v.assigned_driver_id
    LEFT JOIN users u ON u.id = d.user_id
    LEFT JOIN trips t ON t.id = v.current_trip_id
    LEFT JOIN users creator ON creator.id = v.created_by_user_id
  `;
}

export class VehicleRepository {
  async create(client, payload) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `
        INSERT INTO vehicles (
          registration_number,
          name,
          model,
          type,
          capacity_kg,
          current_odometer,
          status,
          chassis_number,
          vehicle_type,
          manufacturer,
          year,
          fuel_type,
          mileage,
          current_fuel_level,
          assigned_driver_id,
          current_trip_id,
          insurance_expiry,
          pollution_expiry,
          fitness_expiry,
          service_due_date,
          last_service_date,
          current_latitude,
          current_longitude,
          created_by_user_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7::vehicle_status, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        )
        RETURNING id
      `,
      [
        payload.registrationNumber,
        payload.name,
        payload.model,
        payload.vehicleType,
        payload.capacity,
        payload.currentOdometer ?? 0,
        payload.status,
        payload.chassisNumber,
        payload.vehicleType,
        payload.manufacturer,
        payload.year,
        payload.fuelType,
        payload.mileage,
        payload.currentFuelLevel,
        payload.assignedDriverId,
        payload.currentTripId,
        payload.insuranceExpiry,
        payload.pollutionExpiry,
        payload.fitnessExpiry,
        payload.serviceDueDate,
        payload.lastServiceDate,
        payload.currentLocation?.latitude ?? null,
        payload.currentLocation?.longitude ?? null,
        payload.createdBy
      ]
    );

    return this.findById(rows[0].id, client);
  }

  async findById(id, client) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `${baseVehicleSelect()} WHERE v.id = $1`,
      [id]
    );

    return rows[0] || null;
  }

  async list(params = {}) {
    const pagination = getPagination(params);
    const { whereClause, values } = buildVehicleFilters(params);
    const sortClause = getSortClause(
      params.sortBy,
      params.sortOrder,
      VEHICLE_SORT_FIELDS,
      "v.created_at DESC"
    );

    const { rows } = await query(
      `
        ${baseVehicleSelect()}
        ${whereClause}
        ORDER BY ${sortClause}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
      `,
      [...values, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `
        SELECT COUNT(*)::int AS total
        FROM vehicles v
        ${whereClause}
      `,
      values
    );

    return {
      items: rows,
      total: countResult.rows[0].total,
      ...pagination
    };
  }

  async update(id, payload, client) {
    const executor = client || { query };
    const fields = [];
    const values = [];
    let index = 1;

    const fieldMap = {
      registrationNumber: "registration_number",
      name: "name",
      model: "model",
      vehicleType: "vehicle_type",
      manufacturer: "manufacturer",
      year: "year",
      fuelType: "fuel_type",
      capacity: "capacity_kg",
      mileage: "mileage",
      currentOdometer: "current_odometer",
      currentFuelLevel: "current_fuel_level",
      assignedDriverId: "assigned_driver_id",
      currentTripId: "current_trip_id",
      insuranceExpiry: "insurance_expiry",
      pollutionExpiry: "pollution_expiry",
      fitnessExpiry: "fitness_expiry",
      serviceDueDate: "service_due_date",
      lastServiceDate: "last_service_date",
      chassisNumber: "chassis_number"
    };

    Object.entries(fieldMap).forEach(([key, column]) => {
      if (payload[key] !== undefined) {
        fields.push(`${column} = $${index}`);
        values.push(payload[key]);
        index += 1;
      }
    });

    if (payload.vehicleType !== undefined) {
      fields.push(`type = $${index}`);
      values.push(payload.vehicleType);
      index += 1;
    }

    if (payload.status !== undefined) {
      fields.push(`status = $${index}::vehicle_status`);
      values.push(payload.status);
      index += 1;
    }

    if (payload.currentLocation?.latitude !== undefined) {
      fields.push(`current_latitude = $${index}`);
      values.push(payload.currentLocation.latitude);
      index += 1;
    }

    if (payload.currentLocation?.longitude !== undefined) {
      fields.push(`current_longitude = $${index}`);
      values.push(payload.currentLocation.longitude);
      index += 1;
    }

    if (!fields.length) {
      return this.findById(id, client);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    await executor.query(
      `
        UPDATE vehicles
        SET ${fields.join(", ")}
        WHERE id = $${index}
      `,
      [...values, id]
    );

    return this.findById(id, client);
  }

  async remove(id, client) {
    const executor = client || { query };
    await executor.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  }

  async listAvailable() {
    const { rows } = await query(
      `
        ${baseVehicleSelect()}
        WHERE v.status = 'AVAILABLE'
        ORDER BY v.registration_number ASC
      `
    );

    return rows;
  }

  async listMaintenanceDue() {
    const { rows } = await query(
      `
        ${baseVehicleSelect()}
        WHERE (
          v.service_due_date IS NOT NULL AND v.service_due_date <= CURRENT_DATE + INTERVAL '30 days'
        ) OR (
          v.insurance_expiry IS NOT NULL AND v.insurance_expiry <= CURRENT_DATE + INTERVAL '30 days'
        ) OR (
          v.pollution_expiry IS NOT NULL AND v.pollution_expiry <= CURRENT_DATE + INTERVAL '30 days'
        ) OR (
          v.fitness_expiry IS NOT NULL AND v.fitness_expiry <= CURRENT_DATE + INTERVAL '30 days'
        )
        ORDER BY v.service_due_date NULLS LAST, v.insurance_expiry NULLS LAST
      `
    );

    return rows;
  }

  async getDashboardSummary() {
    const { rows } = await query(
      `
        SELECT
          COUNT(*)::int AS "totalVehicles",
          COUNT(*) FILTER (WHERE status = 'AVAILABLE')::int AS "availableVehicles",
          COUNT(*) FILTER (WHERE status = 'ASSIGNED')::int AS "assignedVehicles",
          COUNT(*) FILTER (WHERE status = 'IN_TRANSIT')::int AS "inTransitVehicles",
          COUNT(*) FILTER (WHERE status = 'MAINTENANCE')::int AS "maintenanceVehicles",
          COUNT(*) FILTER (WHERE status = 'INACTIVE')::int AS "inactiveVehicles"
        FROM vehicles
      `
    );

    return rows[0];
  }

  async findByRegistrationNumber(registrationNumber) {
    const { rows } = await query(
      `SELECT id FROM vehicles WHERE LOWER(registration_number) = LOWER($1) LIMIT 1`,
      [registrationNumber]
    );

    return rows[0] || null;
  }

  async findActiveTripVehicleConflicts(vehicleId) {
    const { rows } = await query(
      `
        SELECT id
        FROM trips
        WHERE vehicle_id = $1
          AND status IN ('scheduled', 'assigned', 'started', 'in_progress')
        LIMIT 1
      `,
      [vehicleId]
    );

    return rows[0] || null;
  }
}
