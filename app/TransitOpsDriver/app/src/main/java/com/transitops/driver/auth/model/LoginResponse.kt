package com.transitops.driver.auth.model

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(
    val token: String,
    val user: UserDto
)
