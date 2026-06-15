-- SQL Script to seed services for PT. Prima Integrasi Network
-- This script clears the existing services table and inserts the 4 specified services in English:
-- 1. Solution Architecture & Design
-- 2. System Implementation & Integration
-- 3. Optimization & Maintenance
-- 4. Innovative IP Solutions
--
-- You can run this in your Linux VPS bash:
-- mysql -u your_username -p your_database_name < seed_services.sql

-- 1. Clear existing services
DELETE FROM `services`;

-- 2. Insert the 4 services
INSERT INTO `services` (
  `id`,
  `name`,
  `slug`,
  `short_description`,
  `description`,
  `icon`,
  `image_url`,
  `order_number`,
  `is_active`,
  `created_at`,
  `updated_at`
) VALUES
(
  1,
  'Solution Architecture & Design',
  'solution-architecture-design',
  'Business needs analysis and robust infrastructure design for scalable, secure, and high-performance IT environments.',
  'We help you understand business challenges by providing comprehensive needs analysis and targeted technology recommendations. Our services include robust infrastructure design to build scalable, secure, and high-performance system architectures meeting hardware, database, and network requirements.',
  'fas fa-drafting-compass',
  NULL,
  1,
  1,
  NOW(),
  NOW()
),
(
  2,
  'System Implementation & Integration',
  'system-implementation-integration',
  'End-to-end integration of hardware and software components along with automated workflows for operational efficiency.',
  'Providing full system integration to connect various technology components (both hardware and software) to run as a cohesive unit. We handle the deployment and configuration of IT infrastructure (including data centers, networks, and peripheral devices) and develop automated workflows to enhance corporate operational efficiency.',
  'fas fa-cogs',
  NULL,
  2,
  1,
  NOW(),
  NOW()
),
(
  3,
  'Optimization & Maintenance',
  'optimization-maintenance',
  'High-availability performance tuning, end-to-end data security protection, and 24/7 mission-critical technical support.',
  'We ensure your systems run at peak performance (High Availability) backed by real-time data replication technologies. Our services feature end-to-end cybersecurity protection, including data governance, masking, and AI-driven threat mitigation, alongside dedicated 24/7 technical support from our engineering experts.',
  'fas fa-shield-alt',
  NULL,
  3,
  1,
  NOW(),
  NOW()
),
(
  4,
  'Innovative IP Solutions',
  'innovative-ip-solutions',
  'Custom technology development like tactical intelligence and geolocation systems, integrated with AI and data visualization.',
  'We specialize in building tailor-made technology solutions (such as tactical intelligence systems, geolocation mapping, and weapons inventory systems) adapted to the unique needs of government and private sector clients. We also facilitate the adoption of future-ready technologies like AI, voice analysis, and interactive data visualization.',
  'fas fa-lightbulb',
  NULL,
  4,
  1,
  NOW(),
  NOW()
);
