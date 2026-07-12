package com.transitops.driver.di

import com.transitops.driver.auth.repository.AuthRepository
import com.transitops.driver.auth.repository.AuthRepositoryImpl
import com.transitops.driver.home.repository.DriverDashboardRepository
import com.transitops.driver.home.repository.DriverDashboardRepositoryImpl
import com.transitops.driver.data.repository.DriverRepositoryImpl
import com.transitops.driver.data.repository.TripRepositoryImpl
import com.transitops.driver.domain.repository.DriverRepository
import com.transitops.driver.domain.repository.TripRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindTripRepository(
        tripRepositoryImpl: TripRepositoryImpl
    ): TripRepository

    @Binds
    @Singleton
    abstract fun bindDriverRepository(
        driverRepositoryImpl: DriverRepositoryImpl
    ): DriverRepository

    @Binds
    @Singleton
    abstract fun bindDriverDashboardRepository(
        driverDashboardRepositoryImpl: DriverDashboardRepositoryImpl
    ): DriverDashboardRepository
}
