package com.transitops.driver.domain.repository

import com.transitops.driver.core.util.Resource
import com.transitops.driver.trips.model.TripDto
import com.transitops.driver.trips.model.TripListResponse
import kotlinx.coroutines.flow.Flow

interface TripRepository {
    fun getCurrentTrip(): Flow<Resource<TripDto?>>
    fun getMyTrips(page: Int, limit: Int): Flow<Resource<TripListResponse>>
    fun updateTripStatus(id: Int, status: String): Flow<Resource<TripDto>>
}
