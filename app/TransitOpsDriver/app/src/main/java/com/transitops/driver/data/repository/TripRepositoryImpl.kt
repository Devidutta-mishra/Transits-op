package com.transitops.driver.data.repository

import com.transitops.driver.core.util.Resource
import com.transitops.driver.domain.repository.TripRepository
import com.transitops.driver.trips.api.TripApi
import com.transitops.driver.trips.model.TripDto
import com.transitops.driver.trips.model.TripListResponse
import com.transitops.driver.trips.model.TripStatusRequest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import javax.inject.Inject

class TripRepositoryImpl @Inject constructor(
    private val api: TripApi
) : TripRepository {

    override fun getCurrentTrip(): Flow<Resource<TripDto?>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getCurrentTrip()
            if (response.success) {
                emit(Resource.Success(response.data))
            } else {
                emit(Resource.Error(response.message))
            }
        } catch (e: HttpException) {
            if (e.code() == 404) {
                emit(Resource.Success(null))
            } else {
                emit(Resource.Error("HTTP ${e.code()}: ${e.message()}"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Network error occurred"))
        }
    }

    override fun getMyTrips(page: Int, limit: Int): Flow<Resource<TripListResponse>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getMyTrips(page, limit)
            if (response.success) {
                emit(Resource.Success(response.data))
            } else {
                emit(Resource.Error(response.message))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Network error occurred"))
        }
    }

    override fun updateTripStatus(id: Int, status: String): Flow<Resource<TripDto>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.updateTripStatus(id, TripStatusRequest(status))
            if (response.success) {
                emit(Resource.Success(response.data))
            } else {
                emit(Resource.Error(response.message))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Network error occurred"))
        }
    }
}
