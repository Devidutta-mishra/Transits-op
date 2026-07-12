package com.transitops.driver.auth.repository

import com.transitops.driver.auth.api.AuthApi
import com.transitops.driver.auth.model.LoginRequest
import com.transitops.driver.auth.model.LoginResponse
import com.transitops.driver.core.network.ApiClient
import com.transitops.driver.core.util.Resource
import retrofit2.HttpException
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authApi: AuthApi
) : AuthRepository {
    override suspend fun login(email: String, password: String): Resource<LoginResponse> {
        return try {
            // Check health before login
            try {
                val health = authApi.checkHealth()
                if (!health.isSuccessful) {
                    return Resource.Error("Express backend at ${ApiClient.BASE_URL} is unreachable. Health check status: ${health.code()}")
                }
            } catch (e: Exception) {
                return Resource.Error("Unable to reach Express backend at ${ApiClient.BASE_URL}. Check your network connection and server status.")
            }

            val response = authApi.login(LoginRequest(email, password))
            Resource.Success(response.data)
        } catch (e: HttpException) {
            Resource.Error("HTTP ${e.code()}: ${e.message() ?: "Login failed"}")
        } catch (e: Exception) {
            Resource.Error(e.message ?: "An unknown error occurred")
        }
    }
}
