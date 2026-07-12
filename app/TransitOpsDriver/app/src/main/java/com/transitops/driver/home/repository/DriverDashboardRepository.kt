package com.transitops.driver.home.repository

import com.transitops.driver.core.util.Resource
import com.transitops.driver.home.api.DriverDashboardApi
import com.transitops.driver.home.model.DriverDashboardResponse
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

interface DriverDashboardRepository {
    fun getDashboardData(): Flow<Resource<DriverDashboardResponse>>
}

class DriverDashboardRepositoryImpl @Inject constructor(
    private val api: DriverDashboardApi
) : DriverDashboardRepository {
    override fun getDashboardData(): Flow<Resource<DriverDashboardResponse>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDashboardData()
            emit(Resource.Success(response))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "An error occurred"))
        }
    }
}
