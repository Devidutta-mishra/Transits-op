package com.transitops.driver.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Splash.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Splash.route) {
            // Splash Screen placeholder
        }
        composable(Screen.Login.route) {
            // Login Screen placeholder
        }
        composable(Screen.Home.route) {
            // Home Screen placeholder
        }
        composable(Screen.Trips.route) {
            // Trips Screen placeholder
        }
        composable(
            route = Screen.TripDetails.route,
            arguments = listOf(navArgument("tripId") { })
        ) {
            // Trip Details Screen placeholder
        }
        composable(Screen.Profile.route) {
            // Profile Screen placeholder
        }
        composable(Screen.IssueReport.route) {
            // Issue Report Screen placeholder
        }
        composable(Screen.Notifications.route) {
            // Notifications Screen placeholder
        }
    }
}
