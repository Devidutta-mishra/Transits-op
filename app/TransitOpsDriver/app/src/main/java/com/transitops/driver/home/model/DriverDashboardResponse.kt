package com.transitops.driver.home.model

import kotlinx.serialization.Serializable

@Serializable
data class DriverDashboardResponse(
    val driver: DriverSummaryDto,
    val vehicle: VehicleDto?,
    val currentTrip: TripDto?,
    val stats: DriverStatsDto,
    val tasks: List<TaskDto>,
    val notifications: List<NotificationDto>
)

@Serializable
data class DriverSummaryDto(
    val id: String,
    val name: String,
    val employeeId: String,
    val profileImageUrl: String?,
    val isOnline: Boolean
)

@Serializable
data class VehicleDto(
    val id: String,
    val name: String,
    val plateNumber: String,
    val fuelLevel: Float, // 0.0 to 1.0
    val healthStatus: String,
    val tyrePressure: String,
    val engineStatus: String,
    val batteryStatus: String,
    val lastService: String
)

@Serializable
data class TripDto(
    val id: String,
    val tripNumber: String,
    val pickupLocation: String,
    val destination: String,
    val destinationLat: Double,
    val destinationLng: Double,
    val scheduledStart: String,
    val estimatedArrival: String,
    val status: String, // "ASSIGNED", "STARTED", "COMPLETED"
    val progress: Float // 0.0 to 1.0
)

@Serializable
data class DriverStatsDto(
    val todayDistance: String,
    val tripsCompleted: Int,
    val currentShift: String
)

@Serializable
data class TaskDto(
    val id: String,
    val title: String,
    val isCompleted: Boolean
)

@Serializable
data class NotificationDto(
    val id: String,
    val title: String,
    val description: String,
    val timestamp: String,
    val isRead: Boolean,
    val type: String // "TRIP", "MAINTENANCE", "TRAFFIC"
)
