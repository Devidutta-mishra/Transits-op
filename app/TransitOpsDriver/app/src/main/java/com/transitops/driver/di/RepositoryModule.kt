package com.transitops.driver.di

import com.transitops.driver.data.repository.AuthenticationRepositoryImpl
import com.transitops.driver.data.repository.DriverRepositoryImpl
import com.transitops.driver.data.repository.TripRepositoryImpl
import com.transitops.driver.domain.repository.AuthenticationRepository
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
    abstract fun bindAuthenticationRepository(
        authenticationRepositoryImpl: AuthenticationRepositoryImpl
    ): AuthenticationRepository

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
}
