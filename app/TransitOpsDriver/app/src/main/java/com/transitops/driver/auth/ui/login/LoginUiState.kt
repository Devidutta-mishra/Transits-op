package com.transitops.driver.auth.ui.login

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val emailError: String? = null,
    val passwordError: String? = null,
    val errorMessage: String? = null,
    val isRememberMeChecked: Boolean = false
) {
    val isLoginEnabled: Boolean
        get() = email.isNotBlank() && password.isNotBlank() && emailError == null && passwordError == null
}
