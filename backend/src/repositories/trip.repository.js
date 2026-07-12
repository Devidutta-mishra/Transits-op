import { query } from "../database/pool.js";
import { getPagination, getSortClause } from "../utils/query.js";

const TRIP_SORT_FIELDS = {
  createdAt: "t.created_at",
  scheduledStart: "t.scheduled_start",
  estimatedArrival: "t.estimated_arrival",
  status: "t.status",
  tripNumber: "t.trip_number"
};

function baseTripSelect() {
  return `
    SELECT
      t.id,
      t.trip_number AS "tripNumber",
      t.pickup_name AS origin,
      t.pickup_address AS "pickupAddress",
      t.pickup_latitude AS "pickupLatitude",
      t.pickup_longitude AS "pickupLongitude",
      t.destination_name AS destination,
      t.destination_address AS "destinationAddress",
      t.destination_latitude AS "destinationLatitude",
      t.destination_longitude AS "destinationLongitude",
      t.scheduled_start AS "scheduledStart",
      t.actual_start AS "actualStart",
      t.estimated_arrival AS "estimatedArrival",
      t.actual_arrival AS "actualArrival",
      t.distance_km AS "routeDistance",
      t.status,
      t.priority,
      t.cargo_type AS "cargoType",
      t.remarks AS notes,
      t.created_at AS "createdAt",
      t.updated_at AS "updatedAt",
      json_build_object(
        'latitude', t.pickup_latitude,
        'longitude', t.pickup_longitude
      ) AS "currentLocation",
      json_build_object(
        'id', v.id,
        'registrationNumber', v.registration_number,
        'name', v.name,
        'model', v.model,
        'status', v.status::text
      ) AS vehicle,
      json_build_object(
        'id', d.id,
        'status', d.status::text,
        'user', json_build_object(
          'id', u.id,
          'fullName', u.full_name,
          'email', u.email,
          'phone', u.phone
        )
      ) AS driver
    FROM trips t
    LEFT JOIN vehicles v ON v.id = t.vehicle_id
    LEFT JOIN drivers d ON d.id = t.driver_id
    LEFT JOIN users u ON u.id = d.user_id
  `;
}

function buildTripFilters(params, scope = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (params.search) {
    conditions.push(
      `(t.trip_number ILIKE $${index} OR t.pickup_name ILIKE $${index} OR t.destination_name ILIKE $${index})`
    );
    values.push(`%${params.search}%`);
    index += 1;
  }

  if (params.status) {
    conditions.push(`LOWER(t.status) = LOWER($${index})`);
    values.push(params.status);
    index += 1;
  }

  if (params.driverId) {
    conditions.push(`t.driver_id = $${index}`);
    values.push(params.driverId);
    index += 1;
  }

  if (params.vehicleId) {
    conditions.push(`t.vehicle_id = $${index}`);
    values.push(params.vehicleId);
    index += 1;
  }

  if (scope.driverUserId) {
    conditions.push(`d.user_id = $${index}`);
    values.push(scope.driverUserId);
    index += 1;
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values
  };
}

export class TripRepository {
  async findCurrentByDriverUserId(userId) {
    const { rows } = await query(
      `
        SELECT
          t.id,
          t.trip_number AS "tripNumber",
          t.status,
          t.pickup_name AS origin,
          t.pickup_address AS "pickupAddress",
          t.pickup_latitude AS "pickupLatitude",
          t.pickup_longitude AS "pickupLongitude",
          t.destination_name AS destination,
          t.destination_address AS "destinationAddress",
          t.destination_latitude AS "destinationLatitude",
          t.destination_longitude AS "destinationLongitude",
          t.scheduled_start AS "scheduledStart",
          t.actual_start AS "actualStart",
          t.estimated_arrival AS "estimatedArrival",
          t.actual_arrival AS "actualArrival",
          t.distance_km AS "routeDistance",
          t.priority,
          t.cargo_type AS "cargoType",
          t.remarks AS notes,
          t.created_at AS "createdAt",
          t.updated_at AS "updatedAt",
          json_build_object(
            'latitude', t.pickup_latitude,
            'longitude', t.pickup_longitude
          ) AS "currentLocation",
          json_build_object(
            'id', v.id,
            'registrationNumber', v.registration_number,
            'name', v.name,
            'model', v.model,
            'status', v.status::text
          ) AS vehicle,
          json_build_object(
            'id', d.id,
            'status', d.status::text,
            'user', json_build_object(
              'id', u.id,
              'fullName', u.full_name,
              'email', u.email,
              'phone', u.phone
            )
          ) AS driver
        FROM trips t
        INNER JOIN drivers d ON d.id = t.driver_id
        INNER JOIN users u ON u.id = d.user_id
        LEFT JOIN vehicles v ON v.id = t.vehicle_id
        WHERE d.user_id = $1
          AND LOWER(t.status) IN ('assigned', 'started', 'in_progress')
        ORDER BY
          CASE LOWER(t.status)
            WHEN 'started' THEN 1
            WHEN 'in_progress' THEN 2
            WHEN 'assigned' THEN 3
            ELSE 4
          END,
          t.scheduled_start ASC,
          t.id DESC
        LIMIT 1
      `,
      [userId]
    );

    return rows[0] || null;
  }

  async listByDriverUserId(userId, params = {}) {
    const pagination = getPagination(params);
    const values = [userId];
    let index = values.length + 1;
    const conditions = [`d.user_id = $1`];

    if (params.status) {
      conditions.push(`LOWER(t.status) = LOWER($${index})`);
      values.push(params.status);
      index += 1;
    }

    if (params.search) {
      conditions.push(
        `(t.trip_number ILIKE $${index} OR t.pickup_name ILIKE $${index} OR t.destination_name ILIKE $${index})`
      );
      values.push(`%${params.search}%`);
      index += 1;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const sortClause = getSortClause(
      params.sortBy,
      params.sortOrder,
      {
        createdAt: "t.created_at",
        scheduledStart: "t.scheduled_start",
        estimatedArrival: "t.estimated_arrival",
        status: "t.status",
        tripNumber: "t.trip_number"
      },
      "t.scheduled_start"
    );

    const { rows } = await query(
      `
        SELECT
          t.id,
          t.trip_number AS "tripNumber",
          t.status,
          t.pickup_name AS origin,
          t.destination_name AS destination,
          t.scheduled_start AS "scheduledStart",
          t.actual_start AS "actualStart",
          t.estimated_arrival AS "estimatedArrival",
          t.actual_arrival AS "actualArrival",
          t.distance_km AS "routeDistance",
          t.priority,
          t.cargo_type AS "cargoType",
          t.remarks AS notes,
          t.created_at AS "createdAt",
          t.updated_at AS "updatedAt",
          json_build_object(
            'id', v.id,
            'registrationNumber', v.registration_number,
            'name', v.name,
            'model', v.model,
            'status', v.status::text
          ) AS vehicle
        FROM trips t
        INNER JOIN drivers d ON d.id = t.driver_id
        LEFT JOIN vehicles v ON v.id = t.vehicle_id
        ${whereClause}
        ORDER BY ${sortClause}
        LIMIT $${index}
        OFFSET $${index + 1}
      `,
      [...values, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `
        SELECT COUNT(*)::int AS total
        FROM trips t
        INNER JOIN drivers d ON d.id = t.driver_id
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

  async updateDriverTripStatusByUserId(id, userId, status, timestamps = {}) {
    const fields = [`status = $1`, `updated_at = CURRENT_TIMESTAMP`];
    const values = [status];
    let index = 2;

    if (timestamps.actualStart !== undefined) {
      fields.push(`actual_start = $${index}`);
      values.push(timestamps.actualStart);
      index += 1;
    }

    if (timestamps.actualArrival !== undefined) {
      fields.push(`actual_arrival = $${index}`);
      values.push(timestamps.actualArrival);
      index += 1;
    }

    values.push(id, userId);

    const { rows } = await query(
      `
        UPDATE trips t
        SET ${fields.join(", ")}
        FROM drivers d
        WHERE t.driver_id = d.id
          AND t.id = $${index}
          AND d.user_id = $${index + 1}
        RETURNING t.id
      `,
      values
    );

    return rows[0] ? this.findById(rows[0].id) : null;
  }

  async create(client, payload) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `
        INSERT INTO trips (
          trip_number,
          vehicle_id,
          driver_id,
          origin,
          destination,
          intermediate_stops,
          scheduled_start,
          actual_start,
          estimated_arrival,
          actual_arrival,
          route_distance,
          current_latitude,
          current_longitude,
          status,
          fuel_consumed,
          notes,
          created_by_user_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17
        )
        RETURNING id
      `,
      [
        payload.tripNumber,
        payload.vehicleId || null,
        payload.driverId || null,
        payload.origin,
        payload.destination,
        JSON.stringify(payload.intermediateStops || []),
        payload.scheduledStart,
        payload.actualStart || null,
        payload.estimatedArrival || null,
        payload.actualArrival || null,
        payload.routeDistance || null,
        payload.currentLocation?.latitude ?? null,
        payload.currentLocation?.longitude ?? null,
        payload.status,
        payload.fuelConsumed || null,
        payload.notes || null,
        payload.createdBy
      ]
    );

    return this.findById(rows[0].id, client);
  }

  async findById(id, client) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `${baseTripSelect()} WHERE t.id = $1`,
      [id]
    );

    return rows[0] || null;
  }

  async list(params = {}, scope = {}) {
    const pagination = getPagination(params);
    const { whereClause, values } = buildTripFilters(params, scope);
    const sortClause = getSortClause(
      params.sortBy,
      params.sortOrder,
      TRIP_SORT_FIELDS,
      "t.created_at DESC"
    );

    const { rows } = await query(
      `
        ${baseTripSelect()}
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
        FROM trips t
        LEFT JOIN drivers d ON d.id = t.driver_id
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
      tripNumber: "trip_number",
      vehicleId: "vehicle_id",
      driverId: "driver_id",
      origin: "origin",
      destination: "destination",
      scheduledStart: "scheduled_start",
      actualStart: "actual_start",
      estimatedArrival: "estimated_arrival",
      actualArrival: "actual_arrival",
      routeDistance: "route_distance",
      fuelConsumed: "fuel_consumed",
      notes: "notes"
    };

    Object.entries(fieldMap).forEach(([key, column]) => {
      if (payload[key] !== undefined) {
        fields.push(`${column} = $${index}`);
        values.push(payload[key]);
        index += 1;
      }
    });

    if (payload.intermediateStops !== undefined) {
      fields.push(`intermediate_stops = $${index}::jsonb`);
      values.push(JSON.stringify(payload.intermediateStops));
      index += 1;
    }

    if (payload.status !== undefined) {
      fields.push(`status = $${index}`);
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
      `UPDATE trips SET ${fields.join(", ")} WHERE id = $${index}`,
      [...values, id]
    );

    return this.findById(id, client);
  }

  async remove(id, client) {
    const executor = client || { query };
    await executor.query(`DELETE FROM trips WHERE id = $1`, [id]);
  }

  async findByTripNumber(tripNumber) {
    const { rows } = await query(
      `SELECT id FROM trips WHERE LOWER(trip_number) = LOWER($1) LIMIT 1`,
      [tripNumber]
    );

    return rows[0] || null;
  }

  async findActiveByVehicleId(vehicleId) {
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

  async findActiveByDriverId(driverId) {
    const { rows } = await query(
      `
        SELECT id
        FROM trips
        WHERE driver_id = $1
          AND status IN ('scheduled', 'assigned', 'started', 'in_progress')
        LIMIT 1
      `,
      [driverId]
    );

    return rows[0] || null;
  }
}
