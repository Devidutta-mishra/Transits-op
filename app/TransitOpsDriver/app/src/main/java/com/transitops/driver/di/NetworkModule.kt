package com.transitops.driver.di

import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import com.transitops.driver.BuildConfig
import com.transitops.driver.core.constants.NetworkConstants
import com.transitops.driver.data.remote.api.TransitOpsApi
import com.transitops.driver.data.remote.interceptor.AuthInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideJson(): Json {
        return Json {
            ignoreUnknownKeys = true
            coerceInputValues = true
        }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor
    ): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }

        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .addInterceptor(authInterceptor)
            .connectTimeout(NetworkConstants.TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .readTimeout(NetworkConstants.TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .writeTimeout(NetworkConstants.TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideTransitOpsApi(
        okHttpClient: OkHttpClient,
        json: Json
    ): TransitOpsApi {
        val contentType = "application/json".toMediaType()
        return Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
            .create(TransitOpsApi::class.java)
    }
}
