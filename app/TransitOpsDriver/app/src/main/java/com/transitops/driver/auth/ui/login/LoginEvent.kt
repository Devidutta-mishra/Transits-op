package com.transitops.driver.auth.ui.login

sealed class LoginEvent {
    data class EmailChanged(val email: String) : LoginEvent()
    data class PasswordChanged(val password: String) : LoginEvent()
    data class RememberMeChanged(val isChecked: Boolean) : LoginEvent()
    object LoginClicked : LoginEvent()
}
