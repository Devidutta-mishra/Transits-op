import { AppError } from "../utils/appError.js";
import { DashboardRepository } from "../repositories/dashboard.repository.js";

const dashboardRepository = new DashboardRepository();

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function normalizeStatus(value) {
  return String(value || "").toLowerCase();
}

function calculateWorkingHours(trips) {
  const totalMilliseconds = trips.reduce((sum, trip) => {
    const start = trip.actualStart || trip.scheduledStart;
    const end = trip.actualArrival || new Date();

    if (!start || !end) {
      return sum;
    }

    return sum + Math.max(new Date(end).getTime() - new Date(start).getTime(), 0);
  }, 0);

  return Number((totalMilliseconds / (1000 * 60 * 60)).toFixed(2));
}

function buildVehicleHealth(vehicle) {
  if (!vehicle) {
    return {
      engine: null,
      battery: null,
      tyres: null,
      brakes: null,
      overallScore: null
    };
  }

  const now = new Date();
  let score = 100;

  if (vehicle.serviceDueDate && new Date(vehicle.serviceDueDate) < now) {
    score -= 25;
  }

  if (vehicle.insuranceExpiry && new Date(vehicle.insuranceExpiry) < now) {
    score -= 25;
  }

  if (vehicle.currentFuelLevel !== null && vehicle.currentFuelLevel !== undefined) {
    const fuelLevel = Number(vehicle.currentFuelLevel);

    if (fuelLevel < 15) {
      score -= 15;
    }
  }

  return {
    engine: null,
    battery: null,
    tyres: null,
    brakes: null,
    overallScore: Math.max(score, 0)
  };
}

function buildHealthStatus(vehicleHealth) {
  if (vehicleHealth.overallScore === null) {
    return null;
  }

  if (vehicleHealth.overallScore >= 80) {
    return "good";
  }

  if (vehicleHealth.overallScore >= 50) {
    return "warning";
  }

  return "critical";
}

function buildCurrentTrip(currentTrip) {
  if (!currentTrip) {
    return null;
  }

  const routeDistance = toNumber(currentTrip.routeDistance);
  const progressPercentage =
    normalizeStatus(currentTrip.status) === "completed"
      ? 100
      : ["assigned", "scheduled"].includes(normalizeStatus(currentTrip.status))
        ? 0
        : null;

  return {
    id: currentTrip.id,
    tripNumber: currentTrip.tripNumber,
    status: currentTrip.status,
    pickup: currentTrip.origin,
    destination: currentTrip.destination,
    scheduledStart: currentTrip.scheduledStart,
    estimatedArrival: currentTrip.estimatedArrival,
    distanceRemaining:
      currentTrip.status === "completed" ? 0 : routeDistance,
    progressPercentage
  };
}

export class DashboardService {
  async getDriverDashboard(userId) {
    const { driver, todayTrips } =
      await dashboardRepository.getDriverDashboardByUserId(userId);

    if (!driver) {
      throw new AppError("Driver profile not found", 404);
    }

    const activeTrip = driver.trips[0] || null;
    const completedTodayTrips = todayTrips.filter((trip) => trip.status === "completed");
    const vehicleHealth = buildVehicleHealth(driver.assignedVehicle);

    return {
      driver: {
        id: driver.id,
        fullName: driver.user.fullName,
        employeeId: driver.employeeId,
        profilePhoto: null,
        role: driver.user.role.name,
        onlineStatus: ["assigned", "on_trip", "on_duty", "started", "in_progress"].includes(
          normalizeStatus(driver.status)
        )
          ? "online"
          : "offline",
        rating: toNumber(driver.rating),
        phone: driver.user.phone
      },
      vehicle: driver.assignedVehicle
        ? {
            id: driver.assignedVehicle.id,
            registrationNumber: driver.assignedVehicle.registrationNumber,
            model: driver.assignedVehicle.model,
            manufacturer: driver.assignedVehicle.manufacturer,
            fuelLevel: toNumber(driver.assignedVehicle.currentFuelLevel),
            odometer: toNumber(driver.assignedVehicle.currentOdometer),
            status: driver.assignedVehicle.status,
            healthStatus: buildHealthStatus(vehicleHealth),
            insuranceExpiry: driver.assignedVehicle.insuranceExpiry,
            serviceDueDate: driver.assignedVehicle.serviceDueDate
          }
        : null,
      currentTrip: buildCurrentTrip(activeTrip),
      todayStats: {
        tripsCompleted: completedTodayTrips.length,
        distanceTravelled: Number(
          todayTrips.reduce((sum, trip) => sum + (toNumber(trip.routeDistance) || 0), 0).toFixed(2)
        ),
        workingHours: calculateWorkingHours(todayTrips),
        fuelConsumed: Number(
          todayTrips.reduce((sum, trip) => sum + (toNumber(trip.fuelConsumed) || 0), 0).toFixed(2)
        )
      },
      notifications: {
        unreadCount: 0,
        latest: []
      },
      quickActions: {
        canStartTrip: activeTrip
          ? ["assigned", "scheduled"].includes(normalizeStatus(activeTrip.status))
          : false,
        canEndTrip: activeTrip
          ? ["started", "in_progress"].includes(normalizeStatus(activeTrip.status))
          : false,
        canReportIssue: Boolean(driver.assignedVehicle),
        canNavigate: Boolean(activeTrip)
      },
      vehicleHealth
    };
  }

  async getOverview() {
    return dashboardRepository.getOverview();
  }

  async getWebsiteDashboard() {
    return dashboardRepository.getWebsiteDashboard();
  }

  async getFleetHealth() {
    return dashboardRepository.getFleetHealth();
  }

  async getLiveMap() {
    return dashboardRepository.getLiveMap();
  }
}

export const dashboardService = new DashboardService();
