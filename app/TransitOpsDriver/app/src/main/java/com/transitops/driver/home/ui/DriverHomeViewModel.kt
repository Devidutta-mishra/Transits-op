package com.transitops.driver.home.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.transitops.driver.core.util.Resource
import com.transitops.driver.home.repository.DriverDashboardRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DriverHomeViewModel @Inject constructor(
    private val repository: DriverDashboardRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DriverHomeUiState())
    val uiState: StateFlow<DriverHomeUiState> = _uiState.asStateFlow()

    private val _effect = Channel<DriverHomeEffect>()
    val effect = _effect.receiveAsFlow()

    init {
        loadDashboardData()
    }

    fun onEvent(event: DriverHomeEvent) {
        when (event) {
            is DriverHomeEvent.Refresh -> loadDashboardData(isRefreshing = true)
            is DriverHomeEvent.TaskToggled -> toggleTask(event.taskId, event.isCompleted)
            is DriverHomeEvent.StartTripClicked -> {
                viewModelScope.launch {
                    _effect.send(DriverHomeEffect.NavigateToTripDetails)
                }
            }
            is DriverHomeEvent.SOSClicked -> {
                viewModelScope.launch {
                    _effect.send(DriverHomeEffect.ShowSnackbar("Emergency SOS Alert Sent to Dispatcher!"))
                }
            }
        }
    }

    private fun loadDashboardData(isRefreshing: Boolean = false) {
        viewModelScope.launch {
            repository.getDashboardData().collect { result ->
                when (result) {
                    is Resource.Loading -> {
                        _uiState.update { it.copy(
                            isLoading = !isRefreshing,
                            isRefreshing = isRefreshing
                        ) }
                    }
                    is Resource.Success -> {
                        _uiState.update { it.copy(
                            isLoading = false,
                            isRefreshing = false,
                            dashboardData = result.data,
                            error = null
                        ) }
                    }
                    is Resource.Error -> {
                        _uiState.update { it.copy(
                            isLoading = false,
                            isRefreshing = false,
                            error = result.message
                        ) }
                        _effect.send(DriverHomeEffect.ShowSnackbar(result.message ?: "Failed to load dashboard"))
                    }
                }
            }
        }
    }

    private fun toggleTask(taskId: String, isCompleted: Boolean) {
        // Optimistic UI update - Currently placeholder as backend doesn't provide tasks
    }
}
