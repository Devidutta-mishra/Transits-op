package com.transitops.driver.core.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import com.transitops.driver.core.constants.PreferenceKeys
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

@Singleton
class DataStoreManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    val jwtToken: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[PreferenceKeys.JWT_TOKEN]
        }

    suspend fun saveJwtToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.JWT_TOKEN] = token
        }
    }

    val userId: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[PreferenceKeys.USER_ID]
        }

    suspend fun saveUserId(userId: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.USER_ID] = userId
        }
    }

    val userRole: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[PreferenceKeys.USER_ROLE]
        }

    suspend fun saveUserRole(role: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.USER_ROLE] = role
        }
    }

    suspend fun clearAll() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
