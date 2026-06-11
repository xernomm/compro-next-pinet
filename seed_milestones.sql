-- SQL Script to Create milestones table and seed data for PT. Prima Integrasi Network
-- You can run this directly in your Linux VPS bash command line:
-- mysql -u your_username -p your_database_name < seed_milestones.sql

-- 1. Create table milestones
CREATE TABLE IF NOT EXISTS `milestones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(100) NULL COMMENT 'Emoji or icon identifier',
  `image_url` VARCHAR(255) NULL,
  `category` ENUM('founding', 'partnership', 'achievement', 'expansion', 'product') NOT NULL DEFAULT 'achievement',
  `order_number` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Clean existing milestones data (Optional, safe insert)
DELETE FROM `milestones`;

-- 3. Insert corporate milestones
INSERT INTO `milestones` 
  (`year`, `title`, `description`, `icon`, `image_url`, `category`, `order_number`, `is_active`, `created_at`, `updated_at`) 
VALUES
  (2010, 'PT. Prima Integrasi Network Founded', 'PT. Prima Integrasi Network was established in Jakarta with a bold vision: to become Indonesia\'s most trusted IT System Integrator. Starting with a small but passionate team of engineers, the company set out to deliver enterprise-grade infrastructure solutions for mission-critical business environments.', '🏛️', NULL, 'founding', 1, 1, NOW(), NOW()),
  
  (2012, 'Oracle Partnership Established', 'A pivotal moment — PINET became an official Oracle Partner, gaining access to the world\'s leading enterprise database and infrastructure technologies. This partnership opened doors to serving larger enterprise clients with industry-standard solutions backed by Oracle\'s global ecosystem.', '🤝', NULL, 'partnership', 1, 1, NOW(), NOW()),
  
  (2014, 'First Enterprise Data Center Project', 'Successfully designed and deployed a full-scale enterprise data center solution for a major financial institution in Indonesia. This landmark project established PINET\'s reputation as a reliable infrastructure partner capable of handling complex, high-availability environments.', '🏗️', NULL, 'achievement', 1, 1, NOW(), NOW()),
  
  (2015, 'Oracle Gold Partner Status', 'Earned Oracle Gold Partner certification — a recognition of our deep technical expertise, proven delivery track record, and consistent customer satisfaction scores. This elevated status granted access to advanced Oracle resources, training, and priority support channels.', '🥇', NULL, 'partnership', 1, 1, NOW(), NOW()),
  
  (2016, 'Expansion to Cloud Solutions', 'Recognizing the industry\'s shift toward cloud computing, PINET expanded its portfolio to include hybrid cloud architecture, Oracle Cloud Infrastructure (OCI) deployments, and cloud migration services — helping clients modernize their IT landscape without compromising reliability.', '☁️', NULL, 'expansion', 1, 1, NOW(), NOW()),
  
  (2018, '100+ Enterprise Clients Milestone', 'Crossed the milestone of serving 100+ enterprise clients across banking, telecommunications, manufacturing, and government sectors. This achievement reflected PINET\'s growing reputation as a trusted systems integrator in the Indonesian market.', '💯', NULL, 'achievement', 1, 1, NOW(), NOW()),
  
  (2019, 'Oracle Engineered Systems Specialist', 'Achieved Oracle Engineered Systems specialization, becoming one of the few certified partners in Indonesia with deep expertise in Oracle Exadata, Oracle Database Appliance (ODA), and Oracle ZFS Storage — delivering maximum performance for data-intensive workloads.', '⚙️', NULL, 'product', 1, 1, NOW(), NOW()),
  
  (2020, 'Digital Transformation During Pandemic', 'Rapidly pivoted to support clients\' emergency digital transformation needs during the COVID-19 pandemic. Delivered remote infrastructure setups, VPN solutions, and cloud migrations that enabled business continuity for critical operations across Indonesia.', '🌐', NULL, 'achievement', 1, 1, NOW(), NOW()),
  
  (2022, '10th Anniversary & Office Expansion', 'Celebrated a decade of Oracle partnership with a new, expanded office space in Jakarta. The anniversary marked PINET\'s maturation from a startup to a mid-sized systems integrator with a team of 50+ specialized engineers and consultants.', '🎉', NULL, 'expansion', 1, 1, NOW(), NOW()),
  
  (2023, 'Oracle Cloud Infrastructure Focus', 'Deepened commitment to Oracle Cloud Infrastructure (OCI) with dedicated OCI consulting and managed services practice. Helped multiple government agencies and enterprises migrate workloads to OCI, achieving significant cost savings and improved scalability.', '🚀', NULL, 'product', 1, 1, NOW(), NOW()),
  
  (2024, '300+ Projects Delivered', 'Surpassed 300 successfully completed projects — spanning database consolidation, infrastructure modernization, disaster recovery, and cloud migration. Each project reinforced PINET\'s position as a battle-tested technology partner.', '📊', NULL, 'achievement', 1, 1, NOW(), NOW()),
  
  (2025, 'AI & Autonomous Database Initiative', 'Launched a strategic initiative around Oracle Autonomous Database and AI-powered infrastructure management. Positioned to help clients leverage machine learning and autonomous operations for next-generation IT environments.', '🤖', NULL, 'product', 1, 1, NOW(), NOW());
