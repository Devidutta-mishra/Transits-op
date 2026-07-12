package com.transitops.driver.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.transitops.driver.auth.ui.login.LoginScreen
import com.transitops.driver.auth.ui.login.LoginViewModel
import com.transitops.driver.core.network.TokenManager
import com.transitops.driver.home.ui.DriverHomeScreen
import com.transitops.driver.home.ui.DriverHomeViewModel
import kotlinx.coroutines.launch

@Composable
fun NavGraph(
    navController: NavHostController,
    snackbarHostState: SnackbarHostState,
    tokenManager: TokenManager = hiltViewModel<TokenViewModel>().tokenManager,
    startDestination: String = Screen.Splash.route
) {
    val scope = rememberCoroutineScope()
    val token by tokenManager.getToken().collectAsState(initial = null)

    LaunchedEffect(token) {
        if (token == null && navController.currentDestination?.route != Screen.Login.route && navController.currentDestination?.route != Screen.Splash.route) {
            navController.navigate(Screen.Login.route) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Splash.route) {
            // Splash Screen placeholder - in a real app, logic would be here
            // For now, let's just navigate to Login
            androidx.compose.runtime.LaunchedEffect(Unit) {
                navController.navigate(Screen.Login.route) {
                    popUpTo(Screen.Splash.route) { inclusive = true }
                }
            }
        }
        composable(Screen.Login.route) {
            val viewModel: LoginViewModel = hiltViewModel()
            LoginScreen(
                viewModel = viewModel,
                onNavigateToHome = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                showSnackbar = { message ->
                    scope.launch {
                        snackbarHostState.showSnackbar(message)
                    }
                }
            )
        }
        composable(Screen.Home.route) {
            val viewModel: DriverHomeViewModel = hiltViewModel()
            DriverHomeScreen(
                viewModel = viewModel,
                onNavigateToTripDetails = { tripId ->
                    navController.navigate(Screen.TripDetails.createRoute(tripId))
                },
                onNavigateToNotifications = {
                    navController.navigate(Screen.Notifications.route)
                },
                showSnackbar = { message ->
                    scope.launch {
                        snackbarHostState.showSnackbar(message)
                    }
                }
            )
        }
        composable(Screen.Trips.route) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Trips Screen Placeholder")
            }
        }
        composable(
            route = Screen.TripDetails.route,
            arguments = listOf(navArgument("tripId") { })
        ) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Trip Details Placeholder")
            }
        }
        composable(Screen.Profile.route) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Profile Screen Placeholder")
            }
        }
        composable(Screen.IssueReport.route) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Issue Report Placeholder")
            }
        }
        composable(Screen.Notifications.route) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Notifications Placeholder")
            }
        }
    }
}
