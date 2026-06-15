-- SQL Script to add Mba Ayu as Admin Editor in PT. Prima Integrasi Network
-- This inserts the user with role 'admin' so she can bypass the admin login verification check,
-- and uses the default password: Pinet2026!
--
-- You can run this in your Linux VPS bash:
-- mysql -u your_username -p your_database_name < seed_users.sql

INSERT INTO `users` (
  `username`,
  `email`,
  `password`,
  `full_name`,
  `role`,
  `is_active`,
  `created_at`,
  `updated_at`
) VALUES (
  'ayu',
  'ayurejeki249@gmail.com',
  '$2a$10$tZ2n5vB97L4.q6D/3g/jQOy6o3M4wT92cI.zD8z67i/l7YhO9yGxe', -- Bcrypt hash of 'Pinet2026!'
  'Mba Ayu',
  'admin',
  1,
  NOW(),
  NOW()
);
