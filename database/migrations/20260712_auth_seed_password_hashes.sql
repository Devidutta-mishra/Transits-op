UPDATE users
SET password_hash = CASE email
  WHEN 'admin@transitops.com' THEN '$2b$12$YuPcQfNYzZaGZeAQduBwJebZPONMy.7Ys.m2h8rXo9J/yw4oPdjKK'
  WHEN 'fleet@transitops.com' THEN '$2b$12$fk01EcK5h.ej8fsjN.66cuE6nYzOWA5IvA0Qtczj9WJvHN9TVYciq'
  WHEN 'dispatch@transitops.com' THEN '$2b$12$8jThaPxVhDwoRuRt0qDqkuS7dGAIwRem1Wmq1KSMGf73fTItx1W1i'
  WHEN 'safety@transitops.com' THEN '$2b$12$KgYI19xEPGn349o.SrRLL.sdCvU.hCQ6TE/au7q67NuvnqfqiXAHi'
  WHEN 'finance@transitops.com' THEN '$2b$12$C1kem4/w1.MhAUBfuy6wyuMmz0oZ6lmY/7yvBhb/xSbWsjaGLkjQ2'
  WHEN 'alex@transitops.com' THEN '$2b$12$eeGpFUta9gowHTGhYRkgUeQmnlAs5GmKQhKXkbN.d9SiXf30Acr0i'
  ELSE password_hash
END
WHERE email IN (
  'admin@transitops.com',
  'fleet@transitops.com',
  'dispatch@transitops.com',
  'safety@transitops.com',
  'finance@transitops.com',
  'alex@transitops.com'
);
