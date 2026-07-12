package com.transitops.driver.home.ui

sealed class DriverHomeEffect {
    data class ShowSnackbar(val message: String) : DriverHomeEffect()
    object NavigateToTripDetails : DriverHomeEffect()
    object NavigateToNotifications : DriverHomeEffect()
}
