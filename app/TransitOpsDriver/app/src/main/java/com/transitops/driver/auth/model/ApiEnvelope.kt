package com.transitops.driver.auth.model

import kotlinx.serialization.Serializable

@Serializable
data class ApiEnvelope<T>(
    val success: Boolean,
    val message: String,
    val data: T
)
