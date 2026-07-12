package com.transitops.driver.home.ui

import com.transitops.driver.home.model.DriverDashboardResponse

data class DriverHomeUiState(
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val dashboardData: DriverDashboardResponse? = null,
    val error: String? = null
)
