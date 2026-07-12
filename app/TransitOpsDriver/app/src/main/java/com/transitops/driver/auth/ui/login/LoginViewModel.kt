package com.transitops.driver.auth.ui.login

import android.util.Patterns
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.transitops.driver.auth.repository.AuthRepository
import com.transitops.driver.core.preferences.SessionManager
import com.transitops.driver.core.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    private val _effect = Channel<LoginEffect>()
    val effect = _effect.receiveAsFlow()

    fun onEvent(event: LoginEvent) {
        when (event) {
            is LoginEvent.EmailChanged -> {
                _uiState.update { it.copy(email = event.email, emailError = validateEmail(event.email)) }
            }
            is LoginEvent.PasswordChanged -> {
                _uiState.update { it.copy(password = event.password, passwordError = validatePassword(event.password)) }
            }
            is LoginEvent.RememberMeChanged -> {
                _uiState.update { it.copy(isRememberMeChecked = event.isChecked) }
            }
            is LoginEvent.LoginClicked -> {
                login()
            }
        }
    }

    private fun login() {
        val currentState = _uiState.value
        Timber.d("Login attempt with email: ${currentState.email}")

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            
            val result = authRepository.login(currentState.email, currentState.password)
            
            when (result) {
                is Resource.Success -> {
                    result.data?.let { response ->
                        sessionManager.saveToken(response.token)
                        sessionManager.saveUser(response.user)
                        _effect.send(LoginEffect.NavigateToHome)
                    }
                    _uiState.update { it.copy(isLoading = false) }
                }
                is Resource.Error -> {
                    val errorMessage = result.message ?: "An unknown error occurred"
                    _uiState.update { it.copy(isLoading = false, errorMessage = errorMessage) }
                    _effect.send(LoginEffect.ShowError(errorMessage))
                }
                is Resource.Loading -> {
                    // Already handled by initial update
                }
            }
        }
    }

    private fun validateEmail(email: String): String? {
        return when {
            email.isBlank() -> "Email cannot be empty"
            !Patterns.EMAIL_ADDRESS.matcher(email).matches() -> "Invalid email format"
            else -> null
        }
    }

    private fun validatePassword(password: String): String? {
        return if (password.isBlank()) "Password cannot be empty" else null
    }
}
