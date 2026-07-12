package com.transitops.driver.core.constants

import androidx.datastore.preferences.core.stringPreferencesKey

object PreferenceKeys {
    val JWT_TOKEN = stringPreferencesKey("jwt_token")
    val USER_ID = stringPreferencesKey("user_id")
    val USER_ROLE = stringPreferencesKey("user_role")
}
