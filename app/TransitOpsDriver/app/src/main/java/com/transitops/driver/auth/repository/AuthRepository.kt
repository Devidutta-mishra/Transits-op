package com.transitops.driver.auth.repository

import com.transitops.driver.auth.model.LoginResponse
import com.transitops.driver.core.util.Resource

interface AuthRepository {
    suspend fun login(email: String, password: String): Resource<LoginResponse>
}
