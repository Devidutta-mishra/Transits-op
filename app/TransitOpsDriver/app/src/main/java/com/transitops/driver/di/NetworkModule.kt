package com.transitops.driver.di

import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import com.transitops.driver.auth.api.AuthApi
import com.transitops.driver.core.network.ApiClient
import com.transitops.driver.core.network.AuthInterceptor
import com.transitops.driver.home.api.DriverDashboardApi
import com.transitops.driver.trips.api.TripApi
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
            level = HttpLoggingInterceptor.Level.BODY
        }

        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .addInterceptor(authInterceptor)
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient,
        json: Json
    ): Retrofit {
        android.util.Log.d("Network", "Retrofit initializing with Base URL: ${ApiClient.BASE_URL}")
        val contentType = "application/json".toMediaType()
        return Retrofit.Builder()
            .baseUrl(ApiClient.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi {
        return retrofit.create(AuthApi::class.java)
    }

    @Provides
    @Singleton
    fun provideDriverDashboardApi(retrofit: Retrofit): DriverDashboardApi {
        return retrofit.create(DriverDashboardApi::class.java)
    }

    @Provides
    @Singleton
    fun provideTripApi(retrofit: Retrofit): TripApi {
        return retrofit.create(TripApi::class.java)
    }
}
