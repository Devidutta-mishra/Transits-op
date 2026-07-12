import { prisma } from "../database/prisma.js";

export class DashboardRepository {
  async getDriverDashboardByUserId(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [driver, todayTrips] = await prisma.$transaction([
      prisma.driver.findUnique({
        where: {
          userId: Number(userId)
        },
        select: {
          id: true,
          employeeId: true,
          status: true,
          rating: true,
          totalTrips: true,
          totalDistance: true,
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              role: {
                select: {
                  name: true
                }
              }
            }
          },
          assignedVehicle: {
            select: {
              id: true,
              registrationNumber: true,
              model: true,
              manufacturer: true,
              currentFuelLevel: true,
              currentOdometer: true,
              status: true,
              insuranceExpiry: true,
              serviceDueDate: true
            }
          },
          trips: {
            where: {
              status: {
                in: ["assigned", "started", "in_progress"]
              }
            },
            orderBy: [
              { scheduledStart: "asc" },
              { createdAt: "desc" }
            ],
            take: 1,
            select: {
              id: true,
              tripNumber: true,
              status: true,
              origin: true,
              destination: true,
              scheduledStart: true,
              estimatedArrival: true,
              actualArrival: true,
              actualStart: true,
              routeDistance: true,
              fuelConsumed: true,
              trackingLocations: {
                orderBy: {
                  recordedAt: "desc"
                },
                take: 1,
                select: {
                  latitude: true,
                  longitude: true,
                  recordedAt: true
                }
              }
            }
          }
        }
      }),
      prisma.trip.findMany({
        where: {
          driver: {
            userId: Number(userId)
          },
          OR: [
            {
              actualArrival: {
                gte: startOfDay,
                lte: endOfDay
              }
            },
            {
              scheduledStart: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          ]
        },
        select: {
          id: true,
          status: true,
          routeDistance: true,
          fuelConsumed: true,
          actualStart: true,
          actualArrival: true,
          scheduledStart: true
        }
      })
    ]);

    return {
      driver,
      todayTrips
    };
  }

  async getOverview() {
    const [vehicleCounts, tripCounts, completedTripsToday, driverCounts] =
      await prisma.$transaction([
        prisma.vehicle.groupBy({
          by: ["status"],
          _count: {
            _all: true
          }
        }),
        prisma.trip.groupBy({
          by: ["status"],
          _count: {
            _all: true
          }
        }),
        prisma.trip.count({
          where: {
            status: "completed",
            actualArrival: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }),
        prisma.driver.groupBy({
          by: ["status"],
          _count: {
            _all: true
          }
        })
      ]);

    const vehicleMap = Object.fromEntries(
      vehicleCounts.map((item) => [item.status, item._count._all])
    );
    const tripMap = Object.fromEntries(
      tripCounts.map((item) => [item.status, item._count._all])
    );
    const driverMap = Object.fromEntries(
      driverCounts.map((item) => [item.status, item._count._all])
    );

    return {
      totalVehicles: Object.values(vehicleMap).reduce((sum, count) => sum + count, 0),
      activeVehicles: (vehicleMap.ASSIGNED || 0) + (vehicleMap.IN_TRANSIT || 0),
      vehiclesInMaintenance: vehicleMap.MAINTENANCE || 0,
      availableVehicles: vehicleMap.AVAILABLE || 0,
      activeTrips:
        (tripMap.assigned || 0) + (tripMap.started || 0) + (tripMap.in_progress || 0),
      completedTripsToday,
      idleDrivers: (driverMap.AVAILABLE || 0) + (driverMap.OFF_DUTY || 0),
      driversOnDuty:
        (driverMap.ASSIGNED || 0) + (driverMap.ON_TRIP || 0) + (driverMap.ON_DUTY || 0)
    };
  }

  async getFleetHealth() {
    const now = new Date();
    const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [
      upcomingMaintenance,
      expiredInsurance,
      expiredFitness,
      expiringPollutionCertificates
    ] = await prisma.$transaction([
      prisma.vehicle.findMany({
        where: {
          serviceDueDate: {
            lte: inThirtyDays
          }
        },
        orderBy: {
          serviceDueDate: "asc"
        },
        select: {
          id: true,
          registrationNumber: true,
          serviceDueDate: true
        }
      }),
      prisma.vehicle.findMany({
        where: {
          insuranceExpiry: {
            lt: now
          }
        },
        orderBy: {
          insuranceExpiry: "asc"
        },
        select: {
          id: true,
          registrationNumber: true,
          insuranceExpiry: true
        }
      }),
      prisma.vehicle.findMany({
        where: {
          fitnessExpiry: {
            lt: now
          }
        },
        orderBy: {
          fitnessExpiry: "asc"
        },
        select: {
          id: true,
          registrationNumber: true,
          fitnessExpiry: true
        }
      }),
      prisma.vehicle.findMany({
        where: {
          pollutionExpiry: {
            lte: inThirtyDays
          }
        },
        orderBy: {
          pollutionExpiry: "asc"
        },
        select: {
          id: true,
          registrationNumber: true,
          pollutionExpiry: true
        }
      })
    ]);

    return {
      upcomingMaintenance,
      expiredInsurance,
      expiredFitness,
      expiringPollutionCertificates
    };
  }

  async getLiveMap() {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: {
          in: ["ASSIGNED", "IN_TRANSIT"]
        }
      },
      select: {
        id: true,
        registrationNumber: true,
        status: true,
        currentLatitude: true,
        currentLongitude: true,
        assignedDriver: {
          select: {
            id: true,
            employeeId: true,
            user: {
              select: {
                fullName: true
              }
            }
          }
        },
        currentTrip: {
          select: {
            id: true,
            tripNumber: true,
            status: true
          }
        },
        trackingLocations: {
          orderBy: {
            recordedAt: "desc"
          },
          take: 1,
          select: {
            latitude: true,
            longitude: true,
            speed: true,
            recordedAt: true
          }
        }
      }
    });

    return vehicles.map((vehicle) => {
      const latestTracking = vehicle.trackingLocations[0];

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        vehicleStatus: vehicle.status,
        driver: vehicle.assignedDriver
          ? {
              id: vehicle.assignedDriver.id,
              employeeId: vehicle.assignedDriver.employeeId,
              name: vehicle.assignedDriver.user.fullName
            }
          : null,
        trip: vehicle.currentTrip,
        location: {
          latitude: latestTracking?.latitude ?? vehicle.currentLatitude,
          longitude: latestTracking?.longitude ?? vehicle.currentLongitude
        },
        speed: latestTracking?.speed ?? null,
        timestamp: latestTracking?.recordedAt ?? null
      };
    });
  }
}
