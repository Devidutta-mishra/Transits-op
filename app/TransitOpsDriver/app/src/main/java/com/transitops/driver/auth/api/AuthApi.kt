package com.transitops.driver.auth.api

import com.transitops.driver.auth.model.ApiEnvelope
import com.transitops.driver.auth.model.LoginRequest
import com.transitops.driver.auth.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): ApiEnvelope<LoginResponse>

    @GET("health")
    suspend fun checkHealth(): retrofit2.Response<Unit>
}
