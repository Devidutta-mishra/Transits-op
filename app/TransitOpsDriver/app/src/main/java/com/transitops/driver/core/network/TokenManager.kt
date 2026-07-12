package com.transitops.driver.core.network

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.tokenDataStore: DataStore<Preferences> by preferencesDataStore(name = "token_prefs")

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        private val JWT_TOKEN_KEY = stringPreferencesKey("jwt_token")
    }

    fun getToken(): Flow<String?> {
        return context.tokenDataStore.data.map { preferences ->
            preferences[JWT_TOKEN_KEY]
        }
    }

    suspend fun saveToken(token: String) {
        context.tokenDataStore.edit { preferences ->
            preferences[JWT_TOKEN_KEY] = token
        }
    }

    suspend fun clearToken() {
        context.tokenDataStore.edit { preferences ->
            preferences.remove(JWT_TOKEN_KEY)
        }
    }

    suspend fun hasToken(): Boolean {
        return getToken().first() != null
    }
}
