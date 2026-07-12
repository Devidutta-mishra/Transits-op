package com.transitops.driver.trips.model

import kotlinx.serialization.Serializable

@Serializable
data class TripListResponse(
    val trips: List<TripDto>,
    val total: Int,
    val page: Int,
    val limit: Int
)

@Serializable
data class TripStatusRequest(
    val status: String // "Started", "Completed"
)

@Serializable
data class TripDto(
    val id: Int,
    val tripNumber: String,
    val status: String, // "Assigned", "Started", "Completed"
    val pickup: String,
    val destination: String,
    val scheduledStart: String,
    val estimatedArrival: String,
    val distanceRemaining: Double? = null,
    val progressPercentage: Float? = null,
    val completedAt: String? = null
)
