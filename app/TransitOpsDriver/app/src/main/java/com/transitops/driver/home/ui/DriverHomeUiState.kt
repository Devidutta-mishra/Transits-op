package com.transitops.driver.home.ui

import com.transitops.driver.home.model.DriverDashboardData

data class DriverHomeUiState(
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val dashboardData: DriverDashboardData? = null,
    val error: String? = null
)
