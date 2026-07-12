package com.transitops.driver.core.network

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val path = originalRequest.url.encodedPath

        // Do NOT attach Authorization header to login or health endpoints
        if (path.contains(ApiClient.LOGIN_PATH) || path.contains(ApiClient.HEALTH_PATH)) {
            return chain.proceed(originalRequest)
        }

        val token = runBlocking {
            tokenManager.getToken().first()
        }

        val request = originalRequest.newBuilder()
        if (token != null) {
            request.addHeader("Authorization", "Bearer $token")
        }

        val response = chain.proceed(request.build())

        // Handle 401 Unauthorized
        if (response.code == 401) {
            runBlocking {
                tokenManager.clearToken()
            }
            // In a real app, you might want to trigger a navigation to login here
            // via a SharedFlow or by using a BroadcastReceiver/EventBus.
        }

        return response
    }
}
