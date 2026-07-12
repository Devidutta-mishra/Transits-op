import { query } from "../database/pool.js";

export class DashboardRepository {
  async getOverview() {
    const { rows } = await query(
      `
        SELECT
          (SELECT COUNT(*)::int FROM vehicles) AS "totalVehicles",
          (SELECT COUNT(*)::int FROM vehicles WHERE status IN ('ASSIGNED', 'IN_TRANSIT')) AS "activeVehicles",
          (SELECT COUNT(*)::int FROM vehicles WHERE status = 'MAINTENANCE') AS "vehiclesInMaintenance",
          (SELECT COUNT(*)::int FROM vehicles WHERE status = 'AVAILABLE') AS "availableVehicles",
          (SELECT COUNT(*)::int FROM trips WHERE status IN ('assigned', 'started', 'in_progress')) AS "activeTrips",
          (SELECT COUNT(*)::int FROM trips WHERE status = 'completed' AND actual_arrival::date = CURRENT_DATE) AS "completedTripsToday",
          (SELECT COUNT(*)::int FROM drivers WHERE status IN ('AVAILABLE', 'OFF_DUTY')) AS "idleDrivers",
          (SELECT COUNT(*)::int FROM drivers WHERE status IN ('ASSIGNED', 'ON_TRIP', 'ON_DUTY')) AS "driversOnDuty"
      `
    );

    return rows[0];
  }

  async getFleetHealth() {
    const { rows } = await query(
      `
        SELECT json_build_object(
          'upcomingMaintenance', (
            SELECT COALESCE(json_agg(row_to_json(vm)), '[]'::json)
            FROM (
              SELECT id, registration_number AS "registrationNumber", service_due_date AS "serviceDueDate"
              FROM vehicles
              WHERE service_due_date IS NOT NULL
                AND service_due_date <= CURRENT_DATE + INTERVAL '30 days'
              ORDER BY service_due_date ASC
            ) vm
          ),
          'expiredInsurance', (
            SELECT COALESCE(json_agg(row_to_json(vi)), '[]'::json)
            FROM (
              SELECT id, registration_number AS "registrationNumber", insurance_expiry AS "insuranceExpiry"
              FROM vehicles
              WHERE insurance_expiry IS NOT NULL
                AND insurance_expiry < CURRENT_DATE
              ORDER BY insurance_expiry ASC
            ) vi
          ),
          'expiredFitness', (
            SELECT COALESCE(json_agg(row_to_json(vf)), '[]'::json)
            FROM (
              SELECT id, registration_number AS "registrationNumber", fitness_expiry AS "fitnessExpiry"
              FROM vehicles
              WHERE fitness_expiry IS NOT NULL
                AND fitness_expiry < CURRENT_DATE
              ORDER BY fitness_expiry ASC
            ) vf
          ),
          'expiringPollutionCertificates', (
            SELECT COALESCE(json_agg(row_to_json(vp)), '[]'::json)
            FROM (
              SELECT id, registration_number AS "registrationNumber", pollution_expiry AS "pollutionExpiry"
              FROM vehicles
              WHERE pollution_expiry IS NOT NULL
                AND pollution_expiry <= CURRENT_DATE + INTERVAL '30 days'
              ORDER BY pollution_expiry ASC
            ) vp
          )
        ) AS health
      `
    );

    return rows[0].health;
  }

  async getLiveMap() {
    const { rows } = await query(
      `
        SELECT DISTINCT ON (v.id)
          v.id AS "vehicleId",
          v.registration_number AS "registrationNumber",
          v.status::text AS "vehicleStatus",
          json_build_object(
            'id', d.id,
            'employeeId', d.employee_id,
            'name', u.full_name
          ) AS driver,
          json_build_object(
            'id', t.id,
            'tripNumber', t.trip_number,
            'status', t.status
          ) AS trip,
          json_build_object(
            'latitude', COALESCE(tl.latitude, v.current_latitude),
            'longitude', COALESCE(tl.longitude, v.current_longitude)
          ) AS location,
          tl.speed,
          tl.recorded_at AS "timestamp"
        FROM vehicles v
        LEFT JOIN trips t ON t.id = v.current_trip_id
        LEFT JOIN drivers d ON d.id = v.assigned_driver_id
        LEFT JOIN users u ON u.id = d.user_id
        LEFT JOIN tracking_locations tl ON tl.vehicle_id = v.id
        WHERE v.status IN ('ASSIGNED', 'IN_TRANSIT')
        ORDER BY v.id, tl.recorded_at DESC NULLS LAST
      `
    );

    return rows;
  }
}
