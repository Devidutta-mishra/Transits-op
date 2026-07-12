package com.transitops.driver.core.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import com.transitops.driver.auth.model.UserDto
import com.transitops.driver.core.constants.PreferenceKeys
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.sessionDataStore: DataStore<Preferences> by preferencesDataStore(name = "session")

@Singleton
class SessionManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    val token: Flow<String?> = context.sessionDataStore.data.map { it[PreferenceKeys.JWT_TOKEN] }

    suspend fun saveToken(token: String) {
        context.sessionDataStore.edit { it[PreferenceKeys.JWT_TOKEN] = token }
    }

    suspend fun saveUser(user: UserDto) {
        context.sessionDataStore.edit {
            it[PreferenceKeys.USER_ID] = user.id.toString()
            it[PreferenceKeys.USER_ROLE] = user.role
        }
    }

    suspend fun clearSession() {
        context.sessionDataStore.edit { it.clear() }
    }
}
