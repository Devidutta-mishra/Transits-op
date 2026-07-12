-- ============================
-- ENUM TYPES
-- ============================

CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);

CREATE TYPE vehicle_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'IN_SHOP',
    'RETIRED'
);

CREATE TYPE driver_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'OFF_DUTY',
    'SUSPENDED'
);

CREATE TYPE trip_status AS ENUM (
    'DRAFT',
    'DISPATCHED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE maintenance_status AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'COMPLETED'
);

-- ============================
-- ROLES
-- ============================

CREATE TABLE roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- USERS
-- ============================

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    role_id INTEGER NOT NULL
        REFERENCES roles(id)
        ON DELETE RESTRICT,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    phone VARCHAR(20),

    is_active BOOLEAN DEFAULT TRUE,

    status user_status DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- VEHICLES
-- ============================

CREATE TABLE vehicles (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    registration_number VARCHAR(30)
        NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    model VARCHAR(100),

    type VARCHAR(50),

    capacity_kg NUMERIC(10,2) NOT NULL,

    current_odometer NUMERIC(12,2) DEFAULT 0,

    purchase_price NUMERIC(12,2),

    purchase_date DATE,

    status vehicle_status DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- DRIVERS
-- ============================

CREATE TABLE drivers (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(id)
        ON DELETE CASCADE,

    license_number VARCHAR(50)
        NOT NULL UNIQUE,

    license_category VARCHAR(20),

    license_expiry DATE NOT NULL,

    safety_score NUMERIC(5,2)
        DEFAULT 100.00,

    status driver_status
        DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);