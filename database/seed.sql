INSERT INTO roles (name, description) VALUES
('Admin', 'System Administrator'),
('Fleet Manager', 'Fleet Operations'),
('Dispatcher', 'Trip Dispatcher'),
('Safety Officer', 'Safety Compliance'),
('Financial Analyst', 'Finance'),
('Driver', 'Vehicle Driver');

INSERT INTO users
(
role_id,
full_name,
email,
password_hash,
phone
)
VALUES
(1,'Admin','admin@transitops.com','admin123','9999999999'),
(2,'John Fleet','fleet@transitops.com','fleet123','9876543210'),
(3,'David Dispatch','dispatch@transitops.com','dispatch123','9876543211'),
(4,'Sam Safety','safety@transitops.com','safety123','9876543212'),
(5,'Mary Finance','finance@transitops.com','finance123','9876543213'),
(6,'Alex Driver','alex@transitops.com','driver123','9876543214');

INSERT INTO drivers
(
user_id,
license_number,
license_category,
license_expiry
)
VALUES
(
6,
'OD0123456789',
'LMV',
'2028-12-31'
);

INSERT INTO vehicles
(
registration_number,
name,
model,
type,
capacity_kg,
purchase_price
)
VALUES
('OD02AB1234','Tata Ace','Gold','Mini Truck',750,650000),
('OD02CD5678','Ashok Leyland','Dost','Truck',1500,950000);