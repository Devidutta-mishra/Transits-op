import { prisma } from "../database/prisma.js";

export class DashboardRepository {
  async getDriverDashboardByUserId(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [drivers, todayTrips] = await prisma.$transaction([
      prisma.$queryRaw`
        SELECT
          d.id,
          d.user_id AS "userId",
          NULL::text AS "employeeId",
          d.status::text AS status,
          d.safety_score AS rating,
          u.id AS "user.id",
          u.full_name AS "user.fullName",
          u.phone AS "user.phone",
          r.name AS "user.role.name",
          active_trip.id AS "trip.id",
          active_trip.trip_number AS "trip.tripNumber",
          active_trip.status::text AS "trip.status",
          active_trip.pickup_name AS "trip.origin",
          active_trip.destination_name AS "trip.destination",
          active_trip.scheduled_start AS "trip.scheduledStart",
          active_trip.estimated_arrival AS "trip.estimatedArrival",
          active_trip.actual_arrival AS "trip.actualArrival",
          active_trip.actual_start AS "trip.actualStart",
          active_trip.distance_km AS "trip.routeDistance",
          NULL::numeric AS "trip.fuelConsumed",
          vehicle.id AS "vehicle.id",
          vehicle.registration_number AS "vehicle.registrationNumber",
          vehicle.model AS "vehicle.model",
          vehicle.name AS "vehicle.manufacturer",
          NULL::numeric AS "vehicle.currentFuelLevel",
          vehicle.current_odometer AS "vehicle.currentOdometer",
          vehicle.status::text AS "vehicle.status",
          NULL::timestamp AS "vehicle.insuranceExpiry",
          NULL::timestamp AS "vehicle.serviceDueDate"
        FROM drivers d
        INNER JOIN users u ON u.id = d.user_id
        INNER JOIN roles r ON r.id = u.role_id
        LEFT JOIN LATERAL (
          SELECT
            t.id,
            t.trip_number,
            t.status,
            t.pickup_name,
            t.destination_name,
            t.scheduled_start,
            t.estimated_arrival,
            t.actual_arrival,
            t.actual_start,
            t.distance_km,
            t.vehicle_id
          FROM trips t
          WHERE t.driver_id = d.id
            AND LOWER(t.status::text) IN ('assigned', 'started', 'in_progress')
          ORDER BY
            CASE LOWER(t.status::text)
              WHEN 'started' THEN 1
              WHEN 'in_progress' THEN 2
              WHEN 'assigned' THEN 3
              ELSE 4
            END,
            t.scheduled_start ASC,
            t.id DESC
          LIMIT 1
        ) AS active_trip ON TRUE
        LEFT JOIN vehicles vehicle ON vehicle.id = active_trip.vehicle_id
        WHERE d.user_id = ${Number(userId)}
        LIMIT 1
      `,
      prisma.$queryRaw`
        SELECT
          t.id,
          t.status::text AS status,
          t.distance_km AS "routeDistance",
          NULL::numeric AS "fuelConsumed",
          t.actual_start AS "actualStart",
          t.actual_arrival AS "actualArrival",
          t.scheduled_start AS "scheduledStart"
        FROM trips t
        INNER JOIN drivers d ON d.id = t.driver_id
        WHERE d.user_id = ${Number(userId)}
          AND (
            (t.actual_arrival BETWEEN ${startOfDay} AND ${endOfDay})
            OR (t.scheduled_start BETWEEN ${startOfDay} AND ${endOfDay})
          )
        ORDER BY t.scheduled_start DESC, t.id DESC
      `
    ]);

    const row = drivers[0] || null;
    const driver = row
      ? {
          id: row.id,
          userId: row.userId,
          employeeId: row.employeeId,
          status: row.status,
          rating: row.rating,
          totalTrips: todayTrips.length,
          totalDistance: todayTrips.reduce(
            (sum, trip) => sum + Number(trip.routeDistance || 0),
            0
          ),
          user: {
            id: row["user.id"],
            fullName: row["user.fullName"],
            phone: row["user.phone"],
            role: {
              name: row["user.role.name"]
            }
          },
          assignedVehicle: row["vehicle.id"]
            ? {
                id: row["vehicle.id"],
                registrationNumber: row["vehicle.registrationNumber"],
                model: row["vehicle.model"],
                manufacturer: row["vehicle.manufacturer"],
                currentFuelLevel: row["vehicle.currentFuelLevel"],
                currentOdometer: row["vehicle.currentOdometer"],
                status: row["vehicle.status"],
                insuranceExpiry: row["vehicle.insuranceExpiry"],
                serviceDueDate: row["vehicle.serviceDueDate"]
              }
            : null,
          trips: row["trip.id"]
            ? [
                {
                  id: row["trip.id"],
                  tripNumber: row["trip.tripNumber"],
                  status: row["trip.status"],
                  origin: row["trip.origin"],
                  destination: row["trip.destination"],
                  scheduledStart: row["trip.scheduledStart"],
                  estimatedArrival: row["trip.estimatedArrival"],
                  actualArrival: row["trip.actualArrival"],
                  actualStart: row["trip.actualStart"],
                  routeDistance: row["trip.routeDistance"],
                  fuelConsumed: row["trip.fuelConsumed"]
                }
              ]
            : []
        }
      : null;

    return {
      driver,
      todayTrips
    };
  }

  async getOverview() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [row] = await prisma.$queryRaw`
      SELECT
        (SELECT COUNT(*)::int FROM vehicles) AS "totalVehicles",
        (
          SELECT COUNT(DISTINCT t.vehicle_id)::int
          FROM trips t
          WHERE t.vehicle_id IS NOT NULL
            AND LOWER(t.status) IN ('assigned', 'started', 'in_progress')
        ) AS "activeVehicles",
        (
          SELECT COUNT(*)::int
          FROM vehicles v
          WHERE UPPER(v.status::text) IN ('IN_SHOP', 'MAINTENANCE')
        ) AS "vehiclesInMaintenance",
        (
          SELECT COUNT(*)::int
          FROM vehicles v
          WHERE UPPER(v.status::text) = 'AVAILABLE'
        ) AS "availableVehicles",
        (
          SELECT COUNT(*)::int
          FROM trips t
          WHERE LOWER(t.status) IN ('assigned', 'started', 'in_progress')
        ) AS "activeTrips",
        (
          SELECT COUNT(*)::int
          FROM trips t
          WHERE LOWER(t.status) = 'completed'
            AND t.actual_arrival BETWEEN ${startOfDay} AND ${endOfDay}
        ) AS "completedTripsToday",
        (
          SELECT COUNT(*)::int
          FROM drivers d
          WHERE UPPER(d.status::text) IN ('AVAILABLE', 'OFF_DUTY')
        ) AS "idleDrivers",
        (
          SELECT COUNT(DISTINCT t.driver_id)::int
          FROM trips t
          WHERE t.driver_id IS NOT NULL
            AND LOWER(t.status) IN ('assigned', 'started', 'in_progress')
        ) AS "driversOnDuty"
    `;

    return row;
  }

  async getFleetHealth() {
    return {
      upcomingMaintenance: [],
      expiredInsurance: [],
      expiredFitness: [],
      expiringPollutionCertificates: []
    };
  }

  async getLiveMap() {
    const rows = await prisma.$queryRaw`
      SELECT
        v.id AS "vehicleId",
        v.registration_number AS "registrationNumber",
        v.status::text AS "vehicleStatus",
        d.id AS "driverId",
        NULL::text AS "employeeId",
        u.full_name AS "driverName",
        t.id AS "tripId",
        t.trip_number AS "tripNumber",
        t.status AS "tripStatus",
        t.pickup_latitude AS "pickupLatitude",
        t.pickup_longitude AS "pickupLongitude",
        t.destination_latitude AS "destinationLatitude",
        t.destination_longitude AS "destinationLongitude",
        t.updated_at AS "timestamp"
      FROM trips t
      INNER JOIN vehicles v ON v.id = t.vehicle_id
      LEFT JOIN drivers d ON d.id = t.driver_id
      LEFT JOIN users u ON u.id = d.user_id
      WHERE LOWER(t.status) IN ('assigned', 'started', 'in_progress')
      ORDER BY t.updated_at DESC, t.id DESC
    `;

    return rows.map((row) => ({
      vehicleId: row.vehicleId,
      registrationNumber: row.registrationNumber,
      vehicleStatus: row.vehicleStatus,
      driver: row.driverId
        ? {
            id: row.driverId,
            employeeId: row.employeeId,
            name: row.driverName
          }
        : null,
      trip: row.tripId
        ? {
            id: row.tripId,
            tripNumber: row.tripNumber,
            status: row.tripStatus
          }
        : null,
      location: {
        latitude: row.pickupLatitude ?? row.destinationLatitude ?? null,
        longitude: row.pickupLongitude ?? row.destinationLongitude ?? null
      },
      speed: null,
      timestamp: row.timestamp ?? null
    }));
  }

  async getWebsiteDashboard() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthsBack = new Date();
    monthsBack.setMonth(monthsBack.getMonth() - 5, 1);
    monthsBack.setHours(0, 0, 0, 0);

    const [
      overview,
      avgSafetyScoreRow,
      tripRows,
      vehicleStatusRows,
      monthlyTripRows,
      activityRows
    ] = await Promise.all([
      this.getOverview(),
      prisma.$queryRaw`
        SELECT COALESCE(AVG(d.safety_score), 0)::numeric(5, 2) AS "avgSafetyScore"
        FROM drivers d
      `,
      prisma.$queryRaw`
        SELECT
          t.id,
          t.trip_number AS "tripNumber",
          t.pickup_name AS origin,
          t.destination_name AS destination,
          t.status,
          t.scheduled_start AS "scheduledStart",
          t.estimated_arrival AS "estimatedArrival",
          v.registration_number AS "vehicleRegistrationNumber",
          u.full_name AS "driverName"
        FROM trips t
        LEFT JOIN vehicles v ON v.id = t.vehicle_id
        LEFT JOIN drivers d ON d.id = t.driver_id
        LEFT JOIN users u ON u.id = d.user_id
        ORDER BY
          CASE
            WHEN LOWER(t.status) IN ('started', 'in_progress') THEN 1
            WHEN LOWER(t.status) = 'assigned' THEN 2
            WHEN LOWER(t.status) = 'completed' THEN 3
            ELSE 4
          END,
          t.scheduled_start DESC,
          t.id DESC
        LIMIT 5
      `,
      prisma.$queryRaw`
        SELECT
          UPPER(v.status::text) AS status,
          COUNT(*)::int AS count
        FROM vehicles v
        GROUP BY UPPER(v.status::text)
      `,
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', t.scheduled_start) AS month,
          COUNT(*)::int AS count
        FROM trips t
        WHERE t.scheduled_start >= ${monthsBack}
        GROUP BY DATE_TRUNC('month', t.scheduled_start)
        ORDER BY month ASC
      `,
      prisma.$queryRaw`
        SELECT
          event_type AS "eventType",
          event_message AS "eventMessage",
          event_time AS "eventTime"
        FROM (
          SELECT
            CASE
              WHEN LOWER(t.status) = 'completed' THEN 'success'
              WHEN LOWER(t.status) IN ('started', 'in_progress') THEN 'info'
              WHEN LOWER(t.status) = 'cancelled' THEN 'danger'
              ELSE 'warning'
            END AS event_type,
            CASE
              WHEN LOWER(t.status) = 'completed'
                THEN 'Trip ' || t.trip_number || ' completed for ' || COALESCE(v.registration_number, 'unassigned vehicle')
              WHEN LOWER(t.status) IN ('started', 'in_progress')
                THEN 'Trip ' || t.trip_number || ' is active on route to ' || t.destination_name
              WHEN LOWER(t.status) = 'cancelled'
                THEN 'Trip ' || t.trip_number || ' was cancelled'
              ELSE 'Trip ' || t.trip_number || ' assigned for dispatch from ' || t.pickup_name
            END AS event_message,
            COALESCE(t.updated_at, t.created_at) AS event_time
          FROM trips t
          LEFT JOIN vehicles v ON v.id = t.vehicle_id
        ) activity_feed
        ORDER BY event_time DESC
        LIMIT 6
      `
    ]);

    const totalVehicles = overview.totalVehicles || 0;
    const activeDrivers = overview.driversOnDuty || 0;
    const tripVolumeMax = Math.max(
      ...monthlyTripRows.map((row) => Number(row.count || 0)),
      1
    );
    const avgSafetyScore = Number(avgSafetyScoreRow[0]?.avgSafetyScore || 0);

    const statusCounts = {
      available: 0,
      inTrip: 0,
      maintenance: 0,
      idle: overview.idleDrivers || 0
    };

    vehicleStatusRows.forEach((row) => {
      if (row.status === "AVAILABLE") {
        statusCounts.available += Number(row.count || 0);
      } else if (["IN_SHOP", "MAINTENANCE"].includes(row.status)) {
        statusCounts.maintenance += Number(row.count || 0);
      }
    });

    statusCounts.inTrip = overview.activeVehicles || 0;

    const vehicleStatus = [
      {
        label: "Available",
        count: statusCounts.available,
        percentage: totalVehicles ? Math.round((statusCounts.available / totalVehicles) * 100) : 0,
        color: "bg-green-600"
      },
      {
        label: "In Trip",
        count: statusCounts.inTrip,
        percentage: totalVehicles ? Math.round((statusCounts.inTrip / totalVehicles) * 100) : 0,
        color: "bg-[#D97706]"
      },
      {
        label: "Maintenance",
        count: statusCounts.maintenance,
        percentage: totalVehicles ? Math.round((statusCounts.maintenance / totalVehicles) * 100) : 0,
        color: "bg-red-600"
      },
      {
        label: "Idle",
        count: statusCounts.idle,
        percentage: totalVehicles ? Math.round((statusCounts.idle / totalVehicles) * 100) : 0,
        color: "bg-zinc-600"
      }
    ];

    const utilizationHistory = [];
    const monthlyTripMap = new Map(
      monthlyTripRows.map((row) => [new Date(row.month).toISOString().slice(0, 7), Number(row.count || 0)])
    );

    for (let offset = 5; offset >= 0; offset -= 1) {
      const month = new Date();
      month.setMonth(month.getMonth() - offset, 1);
      month.setHours(0, 0, 0, 0);
      const key = month.toISOString().slice(0, 7);
      const count = monthlyTripMap.get(key) || 0;

      utilizationHistory.push({
        month: month.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        rate: Math.min(100, Math.round((count / tripVolumeMax) * 100))
      });
    }

    return {
      totalVehicles,
      activeDrivers,
      tripsToday: overview.completedTripsToday || 0,
      scheduledTrips: overview.activeTrips || 0,
      vehiclesAvailable: overview.availableVehicles || 0,
      vehiclesInMaintenance: overview.vehiclesInMaintenance || 0,
      monthlyRevenue: "₹0",
      fuelCost: "₹0",
      operatingCost: "₹0",
      costPerKm: "₹0.00",
      safetyAlerts: 0,
      driverCompliance: `${avgSafetyScore.toFixed(1)}%`,
      pendingInspections: 0,
      activeIncidents: 0,
      trips: tripRows.map((row) => ({
        id: row.tripNumber,
        vehicle: row.vehicleRegistrationNumber || "Unassigned",
        driver: row.driverName || "Unassigned",
        origin: row.origin,
        destination: row.destination,
        status:
          String(row.status || "").toLowerCase() === "started" ||
          String(row.status || "").toLowerCase() === "in_progress"
            ? "In Transit"
            : String(row.status || "").toLowerCase() === "completed"
              ? "Completed"
              : String(row.status || "").toLowerCase() === "cancelled"
                ? "Cancelled"
                : "Scheduled",
        departureTime: row.scheduledStart
          ? new Date(row.scheduledStart).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })
          : "--",
        eta: row.estimatedArrival
          ? new Date(row.estimatedArrival).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })
          : "--"
      })),
      vehicleStatus,
      utilizationHistory,
      activities: activityRows.map((row, index) => ({
        id: `activity_${index + 1}`,
        message: row.eventMessage,
        timestamp: new Date(row.eventTime).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }).toUpperCase(),
        type: row.eventType
      }))
    };
  }
}
