package com.transitops.driver.auth.model

import kotlinx.serialization.Serializable

@Serializable
data class UserDto(
    val id: Int,
    val fullName: String,
    val email: String,
    val role: String
)
