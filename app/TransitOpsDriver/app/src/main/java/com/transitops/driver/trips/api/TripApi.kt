package com.transitops.driver.trips.api

import com.transitops.driver.auth.model.ApiEnvelope
import com.transitops.driver.trips.model.TripDto
import com.transitops.driver.trips.model.TripListResponse
import com.transitops.driver.trips.model.TripStatusRequest
import retrofit2.http.*

interface TripApi {
    @GET("trips/current")
    suspend fun getCurrentTrip(): ApiEnvelope<TripDto?>

    @GET("trips/my")
    suspend fun getMyTrips(
        @Query("page") page: Int,
        @Query("limit") limit: Int
    ): ApiEnvelope<TripListResponse>

    @PATCH("trips/{id}/driver-status")
    suspend fun updateTripStatus(
        @Path("id") id: Int,
        @Body request: TripStatusRequest
    ): ApiEnvelope<TripDto>
}
