package com.transitops.driver.core.util

sealed class UiEvent {
    data class ShowSnackbar(val message: String) : UiEvent()
    object NavigateBack : UiEvent()
    data class Navigate(val route: String) : UiEvent()
}
