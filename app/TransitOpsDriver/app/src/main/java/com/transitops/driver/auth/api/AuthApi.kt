package com.transitops.driver.auth.api

import com.transitops.driver.auth.model.LoginRequest
import com.transitops.driver.auth.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}
