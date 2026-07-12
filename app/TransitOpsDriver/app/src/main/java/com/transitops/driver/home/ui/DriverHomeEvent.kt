package com.transitops.driver.home.ui

sealed class DriverHomeEvent {
    object Refresh : DriverHomeEvent()
    data class TaskToggled(val taskId: String, val isCompleted: Boolean) : DriverHomeEvent()
    object StartTripClicked : DriverHomeEvent()
    object SOSClicked : DriverHomeEvent()
}
