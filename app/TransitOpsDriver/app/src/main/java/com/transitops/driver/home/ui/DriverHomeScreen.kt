package com.transitops.driver.home.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshContainer
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.unit.dp
import com.transitops.driver.home.ui.components.*
import kotlinx.coroutines.flow.collectLatest

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DriverHomeScreen(
    viewModel: DriverHomeViewModel,
    onNavigateToTripDetails: (String) -> Unit,
    onNavigateToNotifications: () -> Unit,
    showSnackbar: (String) -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    val pullToRefreshState = rememberPullToRefreshState()
    
    if (pullToRefreshState.isRefreshing) {
        LaunchedEffect(true) {
            viewModel.onEvent(DriverHomeEvent.Refresh)
        }
    }
    
    LaunchedEffect(state.isRefreshing) {
        if (state.isRefreshing) {
            pullToRefreshState.startRefresh()
        } else {
            pullToRefreshState.endRefresh()
        }
    }

    LaunchedEffect(Unit) {
        viewModel.effect.collectLatest { effect ->
            when (effect) {
                is DriverHomeEffect.ShowSnackbar -> showSnackbar(effect.message)
                is DriverHomeEffect.NavigateToTripDetails -> {
                    state.dashboardData?.currentTrip?.id?.let { onNavigateToTripDetails(it.toString()) }
                }
                is DriverHomeEffect.NavigateToNotifications -> onNavigateToNotifications()
            }
        }
    }

    Scaffold(
        topBar = {
            DriverTopBar(
                driver = state.dashboardData?.driver,
                onNotificationClick = { onNavigateToNotifications() },
                onSettingsClick = { /* TODO */ }
            )
        },
        bottomBar = {
            BottomNavigationBar(
                currentRoute = BottomNavScreen.Home.route,
                onNavigate = { /* Handle bottom nav */ }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize()
                .nestedScroll(pullToRefreshState.nestedScrollConnection)
        ) {
            when {
                state.isLoading && !state.isRefreshing -> {
                    DashboardSkeleton()
                }
                state.error != null && state.dashboardData == null -> {
                    DashboardError(
                        message = state.error!!,
                        onRetry = { viewModel.onEvent(DriverHomeEvent.Refresh) }
                    )
                }
                else -> {
                    val dashboardData = state.dashboardData
                    
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(bottom = 16.dp)
                    ) {
                        item {
                            VehicleStatusCard(
                                vehicle = dashboardData?.vehicle,
                                stats = dashboardData?.todayStats
                            )
                        }
                        
                        item {
                            CurrentTripCard(
                                trip = dashboardData?.currentTrip,
                                onStartTripClick = { viewModel.onEvent(DriverHomeEvent.StartTripClicked) }
                            )
                        }
                        
                        item {
                            MapPreviewCard(
                                onOpenNavigation = { viewModel.onEvent(DriverHomeEvent.StartTripClicked) }
                            )
                        }
                        
                        item {
                            QuickActionsGrid(
                                quickActions = dashboardData?.quickActions,
                                onActionClick = { action ->
                                    showSnackbar("Opening $action...")
                                }
                            )
                        }
                        
                        item {
                            TaskChecklist(
                                onTaskToggle = { id, completed ->
                                    viewModel.onEvent(DriverHomeEvent.TaskToggled(id, completed))
                                }
                            )
                        }

                        item {
                            NotificationsSection(
                                notifications = dashboardData?.notifications ?: com.transitops.driver.home.model.DashboardNotificationsDto(0, emptyList()),
                                onSeeAllClick = { onNavigateToNotifications() }
                            )
                        }
                        
                        item {
                            VehicleHealthCard(
                                vehicle = dashboardData?.vehicle,
                                vehicleHealth = dashboardData?.vehicleHealth
                            )
                        }
                        
                        item {
                            EmergencyCard(
                                onSosClick = { viewModel.onEvent(DriverHomeEvent.SOSClicked) },
                                onCallDispatcherClick = { showSnackbar("Calling Dispatcher...") }
                            )
                        }
                    }
                }
            }
            
            PullToRefreshContainer(
                state = pullToRefreshState,
                modifier = Modifier.align(Alignment.TopCenter)
            )
        }
    }
}
