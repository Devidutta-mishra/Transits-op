package com.transitops.driver.home.model

import kotlinx.serialization.Serializable

@Serializable
data class DriverDashboardData(
    val driver: DriverSummaryDto,
    val vehicle: VehicleDto?,
    val currentTrip: TripDto?,
    val todayStats: DriverStatsDto,
    val notifications: DashboardNotificationsDto,
    val quickActions: QuickActionsDto,
    val vehicleHealth: VehicleHealthDto
)

@Serializable
data class DriverSummaryDto(
    val id: Int,
    val fullName: String,
    val employeeId: String?,
    val profilePhoto: String?,
    val role: String,
    val onlineStatus: String,
    val rating: Int,
    val phone: String
)

@Serializable
data class VehicleDto(
    val id: Int,
    val registrationNumber: String,
    val model: String,
    val manufacturer: String,
    val fuelLevel: Float?,
    val odometer: Int,
    val status: String,
    val healthStatus: String,
    val insuranceExpiry: String?,
    val serviceDueDate: String?
)

@Serializable
data class TripDto(
    val id: Int,
    val tripNumber: String,
    val status: String,
    val pickup: String,
    val destination: String,
    val scheduledStart: String,
    val estimatedArrival: String,
    val distanceRemaining: Double,
    val progressPercentage: Float?
)

@Serializable
data class DriverStatsDto(
    val tripsCompleted: Int,
    val distanceTravelled: Double,
    val workingHours: Double,
    val fuelConsumed: Double
)

@Serializable
data class DashboardNotificationsDto(
    val unreadCount: Int,
    val latest: List<NotificationDto>
)

@Serializable
data class NotificationDto(
    val id: Int? = null,
    val title: String? = null,
    val description: String? = null,
    val timestamp: String? = null,
    val isRead: Boolean? = null,
    val type: String? = null
)

@Serializable
data class QuickActionsDto(
    val canStartTrip: Boolean,
    val canEndTrip: Boolean,
    val canReportIssue: Boolean,
    val canNavigate: Boolean
)

@Serializable
data class VehicleHealthDto(
    val engine: String?,
    val battery: String?,
    val tyres: String?,
    val brakes: String?,
    val overallScore: Int
)
