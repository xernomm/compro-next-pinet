-- SQL Script to seed clients/customers for PT. Prima Integrasi Network
-- This script clears the existing clients table and inserts the 33 specified clients:
--
-- You can run this in your Linux VPS bash:
-- mysql -u your_username -p your_database_name < seed_clients.sql

-- 1. Clear existing clients
DELETE FROM `clients`;

-- 2. Insert the clients
INSERT INTO `clients` (
  `id`,
  `name`,
  `slug`,
  `description`,
  `logo_url`,
  `website_url`,
  `industry`,
  `project_description`,
  `testimonial`,
  `testimonial_author`,
  `testimonial_position`,
  `collaboration_since`,
  `order_number`,
  `is_featured`,
  `is_active`,
  `created_at`,
  `updated_at`
) VALUES
(1, 'Hotel Mulia Senayan, Jakarta', 'hotel-mulia-senayan-jakarta', 'Five-star luxury hospitality provider in Jakarta.', 'https://logo.clearbit.com/themulia.com', 'https://www.themulia.com', 'Hospitality', 'Infrastructure and network deployment for high-performance guest connectivity.', NULL, NULL, NULL, 2014, 1, 1, 1, NOW(), NOW()),
(2, 'Sinarmas Land', 'sinarmas-land', 'One of the largest property developers in Indonesia.', 'https://logo.clearbit.com/sinarmasland.com', 'https://www.sinarmasland.com', 'Real Estate', 'Data center design, virtualization, and storage management systems.', NULL, NULL, NULL, 2015, 2, 1, 1, NOW(), NOW()),
(3, 'Sequis Life', 'sequis-life', 'Leading life and health insurance provider in Indonesia.', 'https://logo.clearbit.com/sequis.co.id', 'https://www.sequis.co.id', 'Insurance', 'Database replication and business continuity orchestration.', NULL, NULL, NULL, 2016, 3, 0, 1, NOW(), NOW()),
(4, 'Jiwasraya', 'jiwasraya', 'State-owned life insurance company in Indonesia.', 'https://logo.clearbit.com/jiwasraya.co.id', 'https://www.jiwasraya.co.id', 'Insurance', 'Enterprise core database consolidation and performance tuning.', NULL, NULL, NULL, 2013, 4, 0, 1, NOW(), NOW()),
(5, 'Pemerintah Provinsi DKI Jakarta', 'pemerintah-provinsi-dki-jakarta', 'Provincial government of Jakarta.', 'https://logo.clearbit.com/jakarta.go.id', 'https://jakarta.go.id', 'Government', 'Smart city infrastructure, portal optimization, and data security governance.', NULL, NULL, NULL, 2012, 5, 1, 1, NOW(), NOW()),
(6, 'Komisi Pemberantasan Korupsi (KPK)', 'komisi-pemberantasan-korupsi-kpk', 'Corruption Eradication Commission of the Republic of Indonesia.', 'https://logo.clearbit.com/kpk.go.id', 'https://www.kpk.go.id', 'Government', 'High-security database architecture, application integration, and threat prevention.', NULL, NULL, NULL, 2015, 6, 1, 1, NOW(), NOW()),
(7, 'Lotte', 'lotte', 'Multinational retail and food corporation.', 'https://logo.clearbit.com/lotte.co.id', 'https://www.lotte.co.id', 'Retail', 'SD-WAN networking and multi-branch infrastructure optimization.', NULL, NULL, NULL, 2017, 7, 0, 1, NOW(), NOW()),
(8, 'Kementerian Komunikasi dan Informatika (Kemkominfo)', 'kementerian-komunikasi-dan-informatika-kemkominfo', 'Ministry of Communication and Informatics of Indonesia.', 'https://logo.clearbit.com/kominfo.go.id', 'https://www.kominfo.go.id', 'Government', 'National digital transformation support and cloud architecture integration.', NULL, NULL, NULL, 2016, 8, 1, 1, NOW(), NOW()),
(9, 'Taspen', 'taspen', 'State-owned social security provider for civil servants.', 'https://logo.clearbit.com/taspen.co.id', 'https://www.taspen.co.id', 'Financial Services', 'High-availability database administration and system optimization.', NULL, NULL, NULL, 2015, 9, 0, 1, NOW(), NOW()),
(10, 'Perusahaan Listrik Negara (PLN)', 'perusahaan-listrik-negara-pln', 'State-owned electricity distribution utility.', 'https://logo.clearbit.com/pln.co.id', 'https://www.pln.co.id', 'Energy & Utilities', 'Mission-critical database clusters and real-time load orchestration.', NULL, NULL, NULL, 2014, 10, 1, 1, NOW(), NOW()),
(11, 'Polri (Badan Intelijen Keamanan)', 'polri-badan-intelijen-keamanan', 'Intelligence and security agency of the Indonesian National Police.', 'https://logo.clearbit.com/polri.go.id', 'https://www.polri.go.id', 'Government', 'Custom software solutions and high-security tactical intelligence architecture.', NULL, NULL, NULL, 2018, 11, 1, 1, NOW(), NOW()),
(12, 'Sinarmas Forestry', 'sinarmas-forestry', 'Pulp and paper forestry management division of Sinarmas.', 'https://logo.clearbit.com/sinarmasforestry.com', 'https://www.sinarmasforestry.com', 'Agriculture & Forestry', 'Remote branch networking, SD-WAN optimization, and data synchronization.', NULL, NULL, NULL, 2016, 12, 0, 1, NOW(), NOW()),
(13, 'Kementerian Pertahanan Republik Indonesia', 'kementerian-pertahanan-republik-indonesia', 'Ministry of Defense of the Republic of Indonesia.', 'https://logo.clearbit.com/kemhan.go.id', 'https://www.kemhan.go.id', 'Government', 'Military logistics software development and secure data center architectures.', NULL, NULL, NULL, 2019, 13, 1, 1, NOW(), NOW()),
(14, 'Korps Brimob', 'korps-brimob', 'Mobile Brigade Corps of the Indonesian National Police.', 'https://logo.clearbit.com/polri.go.id', 'https://brimob.polri.go.id', 'Government', 'Specialized inventory database and tactical communication integration.', NULL, NULL, NULL, 2020, 14, 1, 1, NOW(), NOW()),
(15, 'Bank DKI', 'bank-dki', 'Regional development bank for the Special Capital Region of Jakarta.', 'https://logo.clearbit.com/bankdki.co.id', 'https://www.bankdki.co.id', 'Banking', 'Core banking database upgrades, tuning, and disaster recovery orchestration.', NULL, NULL, NULL, 2013, 15, 0, 1, NOW(), NOW()),
(16, 'Bank BTPN', 'bank-btpn', 'National private commercial bank in Indonesia.', 'https://logo.clearbit.com/btpn.com', 'https://www.btpn.com', 'Banking', 'Scalable microservices infrastructure and enterprise database management.', NULL, NULL, NULL, 2017, 16, 0, 1, NOW(), NOW()),
(17, 'Bank NISP', 'bank-nisp', 'OCBC NISP, one of the oldest private commercial banks in Indonesia.', 'https://logo.clearbit.com/ocbcnisp.com', 'https://www.ocbcnisp.com', 'Banking', 'Real-time database replication and high-availability systems.', NULL, NULL, NULL, 2015, 17, 0, 1, NOW(), NOW()),
(18, 'Bank BNI', 'bank-bni', 'State-owned commercial bank, Bank Negara Indonesia.', 'https://logo.clearbit.com/bni.co.id', 'https://www.bni.co.id', 'Banking', 'Oracle engineered systems administration and database security solutions.', NULL, NULL, NULL, 2012, 18, 1, 1, NOW(), NOW()),
(19, 'Askes', 'askes', 'Predecessor of BPJS Kesehatan, historical civil servant health insurance.', 'https://logo.clearbit.com/bpjs-kesehatan.go.id', 'https://bpjs-kesehatan.go.id', 'Insurance', 'Database integration and legacy application migration.', NULL, NULL, NULL, 2011, 19, 0, 1, NOW(), NOW()),
(20, 'Indah Kiat Pulp & Paper', 'indah-kiat-pulp-paper', 'One of the largest pulp and paper manufacturing companies in Asia.', 'https://logo.clearbit.com/app.co.id', 'https://www.app.co.id', 'Manufacturing', 'Virtualization and enterprise resource database optimizations.', NULL, NULL, NULL, 2016, 20, 0, 1, NOW(), NOW()),
(21, 'Bank Indonesia', 'bank-indonesia', 'The central bank of the Republic of Indonesia.', 'https://logo.clearbit.com/bi.go.id', 'https://www.bi.go.id', 'Banking', 'High-security financial database integration and data integrity audits.', NULL, NULL, NULL, 2013, 21, 1, 1, NOW(), NOW()),
(22, 'Semen Indonesia', 'semen-indonesia', 'State-owned cement producer and building materials group.', 'https://logo.clearbit.com/sig.id', 'https://sig.id', 'Manufacturing', 'Industrial supply chain database performance tuning and monitoring.', NULL, NULL, NULL, 2015, 22, 0, 1, NOW(), NOW()),
(23, 'BPJS Ketenagakerjaan', 'bpjs-ketenagakerjaan', 'Social security agency for workers in Indonesia.', 'https://logo.clearbit.com/bpjsketenagakerjaan.go.id', 'https://www.bpjsketenagakerjaan.go.id', 'Insurance', 'Oracle database consolidation, security audit, and data warehousing.', NULL, NULL, NULL, 2014, 23, 1, 1, NOW(), NOW()),
(24, 'Orang Tua Group (OT)', 'orang-tua-group-ot', 'Leading fast-moving consumer goods (FMCG) manufacturer.', 'https://logo.clearbit.com/ot.id', 'https://ot.id', 'FMCG', 'SD-WAN deployments, corporate network routing, and data replication.', NULL, NULL, NULL, 2018, 24, 0, 1, NOW(), NOW()),
(25, 'Jamsostek', 'jamsostek', 'Historical state workers social security agency.', 'https://logo.clearbit.com/bpjsketenagakerjaan.go.id', 'https://www.bpjsketenagakerjaan.go.id', 'Insurance', 'Database server migration and infrastructure support services.', NULL, NULL, NULL, 2012, 25, 0, 1, NOW(), NOW()),
(26, 'JNE', 'jne', 'Leading express delivery and logistics services company.', 'https://logo.clearbit.com/jne.co.id', 'https://www.jne.co.id', 'Logistics', 'High-volume transaction database clusters and tracking API integration.', NULL, NULL, NULL, 2017, 26, 0, 1, NOW(), NOW()),
(27, 'Sinarmas MSIG Life', 'sinarmas-msig-life', 'Joint venture life insurance company in Indonesia.', 'https://logo.clearbit.com/sinarmasmsiglife.co.id', 'https://www.sinarmasmsiglife.co.id', 'Insurance', 'High-performance database clustering and active-active replication.', NULL, NULL, NULL, 2016, 27, 0, 1, NOW(), NOW()),
(28, 'Telkomsel', 'telkomsel', 'The largest mobile telecommunications operator in Indonesia.', 'https://logo.clearbit.com/telkomsel.com', 'https://www.telkomsel.com', 'Telecommunication', 'Engineered system support, database cluster maintenance, and optimization.', NULL, NULL, NULL, 2013, 28, 1, 1, NOW(), NOW()),
(29, 'Bank BRI', 'bank-bri', 'State-owned commercial bank, Bank Rakyat Indonesia.', 'https://logo.clearbit.com/bri.co.id', 'https://www.bri.co.id', 'Banking', 'Enterprise data integration, replication, and high-capacity database systems.', NULL, NULL, NULL, 2012, 29, 1, 1, NOW(), NOW()),
(30, 'TNI Angkatan Laut', 'tni-angkatan-laut', 'Indonesian Navy, branch of the Indonesian National Armed Forces.', 'https://logo.clearbit.com/tnial.mil.id', 'https://www.tnial.mil.id', 'Government', 'Tactical geolocation integration and custom secure mapping solutions.', NULL, NULL, NULL, 2019, 30, 1, 1, NOW(), NOW()),
(31, 'Kementerian Keuangan Republik Indonesia (Bea Cukai)', 'kementerian-keuangan-republik-indonesia-bea-cukai', 'Directorate General of Customs and Excise of Indonesia.', 'https://logo.clearbit.com/beacukai.go.id', 'https://www.beacukai.go.id', 'Government', 'Import-export database tuning, integration, and security controls.', NULL, NULL, NULL, 2014, 31, 1, 1, NOW(), NOW()),
(32, 'Direktorat Jenderal Pajak (DJP)', 'direktorat-jenderal-pajak-djp', 'Directorate General of Taxes of the Republic of Indonesia.', 'https://logo.clearbit.com/pajak.go.id', 'https://www.pajak.go.id', 'Government', 'Large-scale database performance optimization and high-availability design.', NULL, NULL, NULL, 2013, 32, 1, 1, NOW(), NOW()),
(33, 'BPJS Kesehatan', 'bpjs-kesehatan', 'Social security agency for healthcare in Indonesia.', 'https://logo.clearbit.com/bpjs-kesehatan.go.id', 'https://bpjs-kesehatan.go.id', 'Insurance', 'National healthcare database performance optimization and data shielding.', NULL, NULL, NULL, 2014, 33, 1, 1, NOW(), NOW());
