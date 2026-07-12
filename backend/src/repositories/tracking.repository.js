import { query } from "../database/pool.js";

export class TrackingRepository {
  async create(client, payload) {
    const executor = client || { query };
    const { rows } = await executor.query(
      `
        INSERT INTO tracking_locations (
          trip_id,
          vehicle_id,
          driver_id,
          latitude,
          longitude,
          speed,
          heading,
          recorded_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_TIMESTAMP))
        RETURNING
          id,
          trip_id AS "tripId",
          vehicle_id AS "vehicleId",
          driver_id AS "driverId",
          latitude,
          longitude,
          speed,
          heading,
          recorded_at AS "timestamp"
      `,
      [
        payload.tripId,
        payload.vehicleId,
        payload.driverId,
        payload.latitude,
        payload.longitude,
        payload.speed ?? null,
        payload.heading ?? null,
        payload.timestamp ?? null
      ]
    );

    return rows[0];
  }

  async getByTripId(tripId, limit = 200) {
    const { rows } = await query(
      `
        SELECT
          id,
          trip_id AS "tripId",
          vehicle_id AS "vehicleId",
          driver_id AS "driverId",
          latitude,
          longitude,
          speed,
          heading,
          recorded_at AS "timestamp"
        FROM tracking_locations
        WHERE trip_id = $1
        ORDER BY recorded_at DESC
        LIMIT $2
      `,
      [tripId, limit]
    );

    return rows;
  }

  async getLive() {
    const { rows } = await query(
      `
        SELECT DISTINCT ON (tl.vehicle_id)
          tl.vehicle_id AS "vehicleId",
          tl.trip_id AS "tripId",
          tl.driver_id AS "driverId",
          tl.latitude,
          tl.longitude,
          tl.speed,
          tl.heading,
          tl.recorded_at AS "timestamp",
          v.registration_number AS "registrationNumber",
          v.status::text AS "vehicleStatus",
          t.trip_number AS "tripNumber",
          t.status AS "tripStatus",
          d.employee_id AS "employeeId",
          u.full_name AS "driverName"
        FROM tracking_locations tl
        INNER JOIN vehicles v ON v.id = tl.vehicle_id
        LEFT JOIN trips t ON t.id = tl.trip_id
        LEFT JOIN drivers d ON d.id = tl.driver_id
        LEFT JOIN users u ON u.id = d.user_id
        ORDER BY tl.vehicle_id, tl.recorded_at DESC
      `
    );

    return rows;
  }
}
