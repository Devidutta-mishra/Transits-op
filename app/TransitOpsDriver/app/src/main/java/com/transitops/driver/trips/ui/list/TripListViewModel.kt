package com.transitops.driver.trips.ui.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.transitops.driver.core.util.Resource
import com.transitops.driver.domain.repository.TripRepository
import com.transitops.driver.trips.model.TripDto
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TripListUiState(
    val isLoading: Boolean = false,
    val trips: List<TripDto> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class TripListViewModel @Inject constructor(
    private val repository: TripRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TripListUiState())
    val uiState: StateFlow<TripListUiState> = _uiState.asStateFlow()

    init {
        loadTrips()
    }

    fun loadTrips() {
        viewModelScope.launch {
            repository.getMyTrips(page = 1, limit = 50).collect { result ->
                when (result) {
                    is Resource.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                    is Resource.Success -> {
                        _uiState.update { it.copy(
                            isLoading = false,
                            trips = result.data?.trips ?: emptyList(),
                            error = null
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
}
