INSERT INTO roles (name, description) VALUES
('Admin', 'System Administrator'),
('Fleet Manager', 'Fleet Operations'),
('Dispatcher', 'Trip Dispatcher'),
('Safety Officer', 'Safety Compliance'),
('Financial Analyst', 'Finance'),
('Driver', 'Vehicle Driver');


INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'Admin', 'admin@transitops.com', '$2b$12$YuPcQfNYzZaGZeAQduBwJebZPONMy.7Ys.m2h8rXo9J/yw4oPdjKK', '9999999999'
FROM roles WHERE name = 'Admin';

INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'John Fleet', 'fleet@transitops.com', '$2b$12$fk01EcK5h.ej8fsjN.66cuE6nYzOWA5IvA0Qtczj9WJvHN9TVYciq', '9876543210'
FROM roles WHERE name = 'Fleet Manager';

INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'David Dispatch', 'dispatch@transitops.com', '$2b$12$8jThaPxVhDwoRuRt0qDqkuS7dGAIwRem1Wmq1KSMGf73fTItx1W1i', '9876543211'
FROM roles WHERE name = 'Dispatcher';

INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'Sam Safety', 'safety@transitops.com', '$2b$12$KgYI19xEPGn349o.SrRLL.sdCvU.hCQ6TE/au7q67NuvnqfqiXAHi', '9876543212'
FROM roles WHERE name = 'Safety Officer';

INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'Mary Finance', 'finance@transitops.com', '$2b$12$C1kem4/w1.MhAUBfuy6wyuMmz0oZ6lmY/7yvBhb/xSbWsjaGLkjQ2', '9876543213'
FROM roles WHERE name = 'Financial Analyst';

INSERT INTO users (role_id, full_name, email, password_hash, phone)
SELECT id, 'Alex Driver', 'alex@transitops.com', '$2b$12$eeGpFUta9gowHTGhYRkgUeQmnlAs5GmKQhKXkbN.d9SiXf30Acr0i', '9876543214'
FROM roles WHERE name = 'Driver';


INSERT INTO drivers
(
user_id,
license_number,
license_category,
license_expiry
)
SELECT
id,
'OD0123456789',
'LMV',
'2028-12-31'
FROM users
WHERE email = 'alex@transitops.com';

INSERT INTO vehicles
(
registration_number,
name,
model,
type,
capacity_kg,
purchase_price,
purchase_date
)
SELECT
'OD02AB1234',
'Tata Ace',
'Gold',
'Mini Truck',
750,
650000,
CURRENT_DATE
WHERE NOT EXISTS (
    SELECT 1
    FROM vehicles
    WHERE registration_number = 'OD02AB1234'
);

INSERT INTO vehicles
(
registration_number,
name,
model,
type,
capacity_kg,
purchase_price,
purchase_date
)
SELECT
'OD02CD5678',
'Ashok Leyland',
'Dost',
'Truck',
1500,
950000,
CURRENT_DATE
WHERE NOT EXISTS (
    SELECT 1
    FROM vehicles
    WHERE registration_number = 'OD02CD5678'
);
