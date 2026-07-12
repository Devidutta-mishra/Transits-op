package com.transitops.driver.home.repository

import com.transitops.driver.core.util.Resource
import com.transitops.driver.home.api.DriverDashboardApi
import com.transitops.driver.home.model.DriverDashboardData
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

interface DriverDashboardRepository {
    fun getDashboardData(): Flow<Resource<DriverDashboardData>>
}

class DriverDashboardRepositoryImpl @Inject constructor(
    private val api: DriverDashboardApi
) : DriverDashboardRepository {
    override fun getDashboardData(): Flow<Resource<DriverDashboardData>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDashboardData()
            if (response.success) {
                emit(Resource.Success(response.data))
            } else {
                emit(Resource.Error(response.message))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "An error occurred"))
        }
    }
}
