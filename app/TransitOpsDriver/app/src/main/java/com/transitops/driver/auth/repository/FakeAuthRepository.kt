package com.transitops.driver.auth.repository

import com.transitops.driver.auth.model.LoginResponse
import com.transitops.driver.auth.model.UserDto
import com.transitops.driver.core.util.Resource
import kotlinx.coroutines.delay
import javax.inject.Inject

class FakeAuthRepository @Inject constructor() : AuthRepository {
    override suspend fun login(email: String, password: String): Resource<LoginResponse> {
        delay(2000) // Simulate network delay
        return if (email == "alex@transitops.com" && password == "driver123") {
            Resource.Success(
                LoginResponse(
                    token = "fake-jwt-token",
                    user = UserDto(
                        id = 6,
                        fullName = "Alex Driver",
                        email = "alex@transitops.com",
                        role = "Driver"
                    )
                )
            )
        } else {
            Resource.Error("Invalid email or password")
        }
    }
}
