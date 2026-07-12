import { query } from "../database/pool.js";
import { getPagination, getSortClause } from "../utils/query.js";

const DRIVER_SORT_FIELDS = {
  createdAt: "d.created_at",
  employeeId: "d.employee_id",
  rating: "d.rating",
  totalTrips: "d.total_trips",
  totalDistance: "d.total_distance"
};

function baseDriverSelect() {
  return `
    SELECT
      d.id,
      d.user_id AS "userId",
      d.employee_id AS "employeeId",
      d.license_number AS "licenseNumber",
      d.license_expiry AS "licenseExpiry",
      d.emergency_contact AS "emergencyContact",
      d.experience_years AS experience,
      d.status::text AS status,
      d.rating,
      d.total_trips AS "totalTrips",
      d.total_distance AS "totalDistance",
      d.created_at AS "createdAt",
      d.updated_at AS "updatedAt",
      json_build_object(
        'id', u.id,
        'fullName', u.full_name,
        'email', u.email,
        'phone', u.phone,
        'status', u.status::text
      ) AS "user",
      json_build_object(
        'id', v.id,
        'registrationNumber', v.registration_number,
        'status', v.status::text
      ) AS "assignedVehicle"
    FROM drivers d
    INNER JOIN users u ON u.id = d.user_id
    LEFT JOIN vehicles v ON v.id = d.assigned_vehicle_id
  `;
}

function buildDriverFilters(params) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (params.search) {
    conditions.push(
      `(u.full_name ILIKE $${index} OR u.email ILIKE $${index} OR d.employee_id ILIKE $${index} OR d.license_number ILIKE $${index})`
    );
    values.push(`%${params.search}%`);
    index += 1;
  }

  if (params.status) {
    conditions.push(`LOWER(d.status::text) = LOWER($${index})`);
    values.push(params.status);
    index += 1;
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values
  };
}

export class DriverRepository {
  async create(client, payload) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `
        INSERT INTO drivers (
          user_id,
          employee_id,
          license_number,
          license_category,
          license_expiry,
          emergency_contact,
          experience_years,
          assigned_vehicle_id,
          status,
          rating,
          total_trips,
          total_distance
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::driver_status, $10, $11, $12)
        RETURNING id
      `,
      [
        payload.userId,
        payload.employeeId,
        payload.licenseNumber,
        payload.licenseCategory || null,
        payload.licenseExpiry,
        payload.emergencyContact || null,
        payload.experience || 0,
        payload.assignedVehicleId || null,
        payload.status,
        payload.rating ?? 0,
        payload.totalTrips ?? 0,
        payload.totalDistance ?? 0
      ]
    );

    return this.findById(rows[0].id, client);
  }

  async findById(id, client) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `${baseDriverSelect()} WHERE d.id = $1`,
      [id]
    );

    return rows[0] || null;
  }

  async findByUserId(userId) {
    const { rows } = await query(
      `${baseDriverSelect()} WHERE d.user_id = $1`,
      [userId]
    );

    return rows[0] || null;
  }

  async list(params = {}) {
    const pagination = getPagination(params);
    const { whereClause, values } = buildDriverFilters(params);
    const sortClause = getSortClause(
      params.sortBy,
      params.sortOrder,
      DRIVER_SORT_FIELDS,
      "d.created_at DESC"
    );

    const { rows } = await query(
      `
        ${baseDriverSelect()}
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
        FROM drivers d
        INNER JOIN users u ON u.id = d.user_id
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
      employeeId: "employee_id",
      licenseNumber: "license_number",
      licenseCategory: "license_category",
      licenseExpiry: "license_expiry",
      emergencyContact: "emergency_contact",
      experience: "experience_years",
      assignedVehicleId: "assigned_vehicle_id",
      rating: "rating",
      totalTrips: "total_trips",
      totalDistance: "total_distance"
    };

    Object.entries(fieldMap).forEach(([key, column]) => {
      if (payload[key] !== undefined) {
        fields.push(`${column} = $${index}`);
        values.push(payload[key]);
        index += 1;
      }
    });

    if (payload.status !== undefined) {
      fields.push(`status = $${index}::driver_status`);
      values.push(payload.status);
      index += 1;
    }

    if (!fields.length) {
      return this.findById(id, client);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    await executor.query(
      `UPDATE drivers SET ${fields.join(", ")} WHERE id = $${index}`,
      [...values, id]
    );

    return this.findById(id, client);
  }

  async remove(id, client) {
    const executor = client || { query };
    await executor.query(`DELETE FROM drivers WHERE id = $1`, [id]);
  }

  async findByEmployeeId(employeeId) {
    const { rows } = await query(
      `SELECT id FROM drivers WHERE LOWER(employee_id) = LOWER($1) LIMIT 1`,
      [employeeId]
    );

    return rows[0] || null;
  }

  async findByLicenseNumber(licenseNumber) {
    const { rows } = await query(
      `SELECT id FROM drivers WHERE LOWER(license_number) = LOWER($1) LIMIT 1`,
      [licenseNumber]
    );

    return rows[0] || null;
  }

  async getPerformance(id) {
    const { rows } = await query(
      `
        SELECT
          d.id,
          d.employee_id AS "employeeId",
          d.rating,
          d.total_trips AS "totalTrips",
          d.total_distance AS "totalDistance",
          COUNT(t.id) FILTER (WHERE t.status = 'completed')::int AS "completedTrips",
          COUNT(t.id) FILTER (WHERE t.status IN ('scheduled', 'assigned', 'started', 'in_progress'))::int AS "activeTrips",
          COALESCE(AVG(t.route_distance) FILTER (WHERE t.status = 'completed'), 0)::numeric(10,2) AS "averageTripDistance"
        FROM drivers d
        LEFT JOIN trips t ON t.driver_id = d.id
        WHERE d.id = $1
        GROUP BY d.id
      `,
      [id]
    );

    return rows[0] || null;
  }
}
