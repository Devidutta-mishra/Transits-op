package com.transitops.driver.home.api

import com.transitops.driver.auth.model.ApiEnvelope
import com.transitops.driver.home.model.DriverDashboardData
import com.transitops.driver.home.model.TripDto
import com.transitops.driver.home.model.VehicleDto
import com.transitops.driver.home.model.NotificationDto
import retrofit2.http.GET

interface DriverDashboardApi {
    @GET("dashboard/driver")
    suspend fun getDashboardData(): ApiEnvelope<DriverDashboardData>

    @GET("trips/current")
    suspend fun getCurrentTrip(): TripDto

    @GET("notifications")
    suspend fun getNotifications(): List<NotificationDto>

    @GET("vehicle/current")
    suspend fun getCurrentVehicle(): VehicleDto
}
