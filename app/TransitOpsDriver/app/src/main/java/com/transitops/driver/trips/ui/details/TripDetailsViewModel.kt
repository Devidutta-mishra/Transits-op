package com.transitops.driver.trips.ui.details

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.transitops.driver.core.util.Resource
import com.transitops.driver.domain.repository.TripRepository
import com.transitops.driver.trips.model.TripDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TripDetailsUiState(
    val isLoading: Boolean = false,
    val trip: TripDto? = null,
    val error: String? = null,
    val isActionLoading: Boolean = false
)

sealed class TripDetailsEffect {
    data class ShowError(val message: String) : TripDetailsEffect()
    object TripUpdated : TripDetailsEffect()
}

@HiltViewModel
class TripDetailsViewModel @Inject constructor(
    private val repository: TripRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TripDetailsUiState())
    val uiState: StateFlow<TripDetailsUiState> = _uiState.asStateFlow()

    private val _effect = Channel<TripDetailsEffect>()
    val effect = _effect.receiveAsFlow()

    fun loadCurrentTrip() {
        viewModelScope.launch {
            repository.getCurrentTrip().collect { result ->
                when (result) {
                    is Resource.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                    is Resource.Success -> {
                        _uiState.update { it.copy(
                            isLoading = false,
                            trip = result.data,
                            error = if (result.data == null) "No active trip found" else null
                        ) }
                    }
                    is Resource.Error -> {
                        _uiState.update { it.copy(
                            isLoading = false,
                            error = result.message
                        ) }
                    }
                }
            }
        }
    }

    fun updateStatus(status: String) {
        val tripId = _uiState.value.trip?.id ?: return
        viewModelScope.launch {
            repository.updateTripStatus(tripId, status).collect { result ->
                when (result) {
                    is Resource.Loading -> {
                        _uiState.update { it.copy(isActionLoading = true) }
                    }
                    is Resource.Success -> {
                        _uiState.update { it.copy(
                            isActionLoading = false,
                            trip = result.data
                        ) }
                        _effect.send(TripDetailsEffect.TripUpdated)
                    }
                    is Resource.Error -> {
                        _uiState.update { it.copy(isActionLoading = false) }
                        _effect.send(TripDetailsEffect.ShowError(result.message ?: "Failed to update status"))
                    }
                }
            }
        }
    }
}
