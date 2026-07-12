package com.transitops.driver.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object Home : Screen("home")
    object Trips : Screen("trips")
    object TripDetails : Screen("trip_details/{tripId}") {
        fun createRoute(tripId: String) = "trip_details/$tripId"
    }
    object Profile : Screen("profile")
    object IssueReport : Screen("issue_report")
    object Notifications : Screen("notifications")
}
