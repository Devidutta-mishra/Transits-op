package com.transitops.driver.trips.ui.details

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.transitops.driver.trips.ui.list.StatusBadge
import kotlinx.coroutines.flow.collectLatest

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TripDetailsScreen(
    viewModel: TripDetailsViewModel,
    tripId: String?,
    showSnackbar: (String) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(tripId) {
        viewModel.loadCurrentTrip()
    }

    LaunchedEffect(Unit) {
        viewModel.effect.collectLatest { effect ->
            when (effect) {
                is TripDetailsEffect.ShowError -> showSnackbar(effect.message)
                is TripDetailsEffect.TripUpdated -> showSnackbar("Trip status updated successfully")
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Trip Details") })
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues).fillMaxSize()) {
            if (state.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else if (state.error != null) {
                Text(text = state.error!!, modifier = Modifier.align(Alignment.Center), color = MaterialTheme.colorScheme.error)
            } else {
                state.trip?.let { trip ->
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = "Trip: ${trip.tripNumber}", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.headlineSmall)
                                    StatusBadge(status = trip.status)
                                }
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(text = "Pickup", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.outline)
                                Text(text = trip.pickup, style = MaterialTheme.typography.bodyLarge)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(text = "Destination", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.outline)
                                Text(text = trip.destination, style = MaterialTheme.typography.bodyLarge)
                            }
                        }

                        if (state.isActionLoading) {
                            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
                        }

                        when (trip.status) {
                            "Assigned" -> {
                                Button(
                                    onClick = { viewModel.updateStatus("Started") },
                                    modifier = Modifier.fillMaxWidth().height(56.dp),
                                    enabled = !state.isActionLoading
                                ) {
                                    Icon(Icons.Default.PlayArrow, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("START TRIP")
                                }
                            }
                            "Started" -> {
                                Button(
                                    onClick = { viewModel.updateStatus("Completed") },
                                    modifier = Modifier.fillMaxWidth().height(56.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary),
                                    enabled = !state.isActionLoading
                                ) {
                                    Icon(Icons.Default.Check, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("COMPLETE TRIP")
                                }
                            }
                            "Completed" -> {
                                Text(
                                    text = "This trip has been completed.",
                                    modifier = Modifier.fillMaxWidth(),
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.outline,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
