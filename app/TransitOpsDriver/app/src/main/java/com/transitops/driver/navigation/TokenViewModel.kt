package com.transitops.driver.navigation

import androidx.lifecycle.ViewModel
import com.transitops.driver.core.network.TokenManager
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class TokenViewModel @Inject constructor(
    val tokenManager: TokenManager
) : ViewModel()
