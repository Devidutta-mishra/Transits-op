DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'ASSIGNED'
      AND enumtypid = 'vehicle_status'::regtype
  ) THEN
    ALTER TYPE vehicle_status ADD VALUE 'ASSIGNED';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'IN_TRANSIT'
      AND enumtypid = 'vehicle_status'::regtype
  ) THEN
    ALTER TYPE vehicle_status ADD VALUE 'IN_TRANSIT';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'MAINTENANCE'
      AND enumtypid = 'vehicle_status'::regtype
  ) THEN
    ALTER TYPE vehicle_status ADD VALUE 'MAINTENANCE';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'INACTIVE'
      AND enumtypid = 'vehicle_status'::regtype
  ) THEN
    ALTER TYPE vehicle_status ADD VALUE 'INACTIVE';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'ASSIGNED'
      AND enumtypid = 'driver_status'::regtype
  ) THEN
    ALTER TYPE driver_status ADD VALUE 'ASSIGNED';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'ON_DUTY'
      AND enumtypid = 'driver_status'::regtype
  ) THEN
    ALTER TYPE driver_status ADD VALUE 'ON_DUTY';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'INACTIVE'
      AND enumtypid = 'driver_status'::regtype
  ) THEN
    ALTER TYPE driver_status ADD VALUE 'INACTIVE';
  END IF;
END $$;

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100),
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(30),
  ADD COLUMN IF NOT EXISTS mileage NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS current_fuel_level NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS assigned_driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
  ADD COLUMN IF NOT EXISTS pollution_expiry DATE,
  ADD COLUMN IF NOT EXISTS fitness_expiry DATE,
  ADD COLUMN IF NOT EXISTS service_due_date DATE,
  ADD COLUMN IF NOT EXISTS last_service_date DATE,
  ADD COLUMN IF NOT EXISTS current_latitude NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS current_longitude NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
  ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(100),
  ADD COLUMN IF NOT EXISTS experience_years NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assigned_vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_trips INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_distance NUMERIC(12,2) DEFAULT 0;

UPDATE drivers
SET employee_id = COALESCE(employee_id, CONCAT('DRV-', LPAD(id::text, 5, '0')));

ALTER TABLE drivers
  ALTER COLUMN employee_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_drivers_employee_id ON drivers(employee_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_assigned_vehicle ON drivers(assigned_vehicle_id);

CREATE TABLE IF NOT EXISTS trips (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_number VARCHAR(50) NOT NULL UNIQUE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  intermediate_stops JSONB DEFAULT '[]'::jsonb,
  scheduled_start TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  estimated_arrival TIMESTAMP,
  actual_arrival TIMESTAMP,
  route_distance NUMERIC(12,2),
  current_latitude NUMERIC(10,7),
  current_longitude NUMERIC(10,7),
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'assigned', 'started', 'in_progress', 'completed', 'cancelled')),
  fuel_consumed NUMERIC(12,2),
  notes TEXT,
  created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS current_trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vehicles_registration_number ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_trip_number ON trips(trip_number);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);

CREATE TABLE IF NOT EXISTS tracking_locations (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  speed NUMERIC(10,2),
  heading NUMERIC(10,2),
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracking_trip_timestamp ON tracking_locations(trip_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_vehicle_timestamp ON tracking_locations(vehicle_id, recorded_at DESC);
