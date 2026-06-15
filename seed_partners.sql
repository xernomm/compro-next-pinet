-- SQL Script to seed partners for PT. Prima Integrasi Network
-- This script clears the existing partners table and inserts the 34 specified partners:
-- You can run this in your Linux VPS bash:
-- mysql -u your_username -p your_database_name < seed_partners.sql

-- 1. Clear existing partners
DELETE FROM `partners`;

-- 2. Insert the partners
INSERT INTO `partners` (
  `id`,
  `name`,
  `slug`,
  `description`,
  `logo_url`,
  `website_url`,
  `partnership_type`,
  `partnership_since`,
  `order_number`,
  `is_active`,
  `created_at`,
  `updated_at`
) VALUES
(1, 'VMware', 'vmware', 'Enterprise virtualization and multi-cloud solutions.', 'https://logo.clearbit.com/vmware.com', 'https://www.vmware.com', 'Technology Partner', 2015, 1, 1, NOW(), NOW()),
(2, 'Lenovo', 'lenovo', 'Reliable enterprise servers, storage, and computing systems.', 'https://logo.clearbit.com/lenovo.com', 'https://www.lenovo.com', 'Hardware Partner', 2016, 2, 1, NOW(), NOW()),
(3, 'MapR Data Technologies', 'mapr-data-technologies', 'Converged data platform for big data and real-time analytics.', 'https://logo.clearbit.com/mapr.com', 'https://www.mapr.com', 'Data & AI Partner', 2017, 3, 1, NOW(), NOW()),
(4, 'Huawei', 'huawei', 'Global information and communications technology infrastructure.', 'https://logo.clearbit.com/huawei.com', 'https://e.huawei.com', 'Hardware & Network Partner', 2018, 4, 1, NOW(), NOW()),
(5, 'Hewlett Packard Enterprise', 'hewlett-packard-enterprise', 'Edge-to-cloud platform as-a-service and enterprise IT systems.', 'https://logo.clearbit.com/hpe.com', 'https://www.hpe.com', 'Hardware Partner', 2014, 5, 1, NOW(), NOW()),
(6, 'watsonx', 'watsonx', 'IBM next-generation AI and data platform for enterprise.', 'https://logo.clearbit.com/ibm.com', 'https://www.ibm.com/watsonx', 'Data & AI Partner', 2023, 6, 1, NOW(), NOW()),
(7, 'IBM Spectrum Storage', 'ibm-spectrum-storage', 'Software-defined storage and data protection architecture.', 'https://logo.clearbit.com/ibm.com', 'https://www.ibm.com', 'Storage Partner', 2015, 7, 1, NOW(), NOW()),
(8, 'Citrix', 'citrix', 'Digital workspace and secure application delivery solution.', 'https://logo.clearbit.com/citrix.com', 'https://www.citrix.com', 'Virtualization Partner', 2016, 8, 1, NOW(), NOW()),
(9, 'METIS', 'metis', 'Advanced defense technology, mapping, and security solutions.', 'https://logo.clearbit.com/metis.io', 'https://metis.io', 'Strategic IP Partner', 2021, 9, 1, NOW(), NOW()),
(10, 'Office 365', 'office-365', 'Microsoft productivity and cloud-based collaboration suite.', 'https://logo.clearbit.com/office.com', 'https://www.office.com', 'Collaboration Partner', 2014, 10, 1, NOW(), NOW()),
(11, 'SAS', 'sas', 'Enterprise analytics, business intelligence, and data management software.', 'https://logo.clearbit.com/sas.com', 'https://www.sas.com', 'Analytics Partner', 2018, 11, 1, NOW(), NOW()),
(12, 'Couchbase', 'couchbase', 'High-performance distributed NoSQL document database.', 'https://logo.clearbit.com/couchbase.com', 'https://www.couchbase.com', 'Database Partner', 2019, 12, 1, NOW(), NOW()),
(13, 'Microsoft Power BI', 'microsoft-power-bi', 'Interactive data visualization and business intelligence tool.', 'https://logo.clearbit.com/microsoft.com', 'https://powerbi.microsoft.com', 'Analytics Partner', 2017, 13, 1, NOW(), NOW()),
(14, 'Tableau', 'tableau', 'Leading analytics platform for visual business intelligence.', 'https://logo.clearbit.com/tableau.com', 'https://www.tableau.com', 'Analytics Partner', 2016, 14, 1, NOW(), NOW()),
(15, 'Splunk', 'splunk', 'Data-to-everything platform for security, observability, and log analysis.', 'https://logo.clearbit.com/splunk.com', 'https://www.splunk.com', 'Security & Observability Partner', 2018, 15, 1, NOW(), NOW()),
(16, 'Oracle', 'oracle', 'Comprehensive cloud applications, database, and platform services.', 'https://logo.clearbit.com/oracle.com', 'https://www.oracle.com', 'Principal Database & Cloud Partner', 2012, 16, 1, NOW(), NOW()),
(17, 'Apache Spark', 'apache-spark', 'Unified engine for large-scale data processing and machine learning.', 'https://logo.clearbit.com/spark.apache.org', 'https://spark.apache.org', 'Open Source Partner', 2018, 17, 1, NOW(), NOW()),
(18, 'TOAD', 'toad', 'Database management toolset for database developers and DBAs.', 'https://logo.clearbit.com/quest.com', 'https://www.quest.com/toad', 'Database Tooling Partner', 2013, 18, 1, NOW(), NOW()),
(19, 'IBM DB2', 'ibm-db2', 'Enterprise relational database management system from IBM.', 'https://logo.clearbit.com/ibm.com', 'https://www.ibm.com/db2', 'Database Partner', 2015, 19, 1, NOW(), NOW()),
(20, 'TigerGraph', 'tigergraph', 'Scalable enterprise graph database platform for deep analytics.', 'https://logo.clearbit.com/tigergraph.com', 'https://www.tigergraph.com', 'Database Partner', 2020, 20, 1, NOW(), NOW()),
(21, 'Apache Drill', 'apache-drill', 'Schema-free SQL query engine for Big Data and NoSQL sources.', 'https://logo.clearbit.com/drill.apache.org', 'https://drill.apache.org', 'Open Source Partner', 2019, 21, 1, NOW(), NOW()),
(22, 'Cisco', 'cisco', 'Global leader in networking, secure connectivity, and routing infrastructure.', 'https://logo.clearbit.com/cisco.com', 'https://www.cisco.com', 'Networking & Security Partner', 2013, 22, 1, NOW(), NOW()),
(23, 'Trend Micro', 'trend-micro', 'Global leader in cybersecurity and cloud threat defense.', 'https://logo.clearbit.com/trendmicro.com', 'https://www.trendmicro.com', 'Security Partner', 2016, 23, 1, NOW(), NOW()),
(24, 'Oracle GoldenGate', 'oracle-golden-gate', 'Real-time data integration and replication platform.', 'https://logo.clearbit.com/oracle.com', 'https://www.oracle.com/integration/goldengate', 'Principal Integration Partner', 2012, 24, 1, NOW(), NOW()),
(25, 'Juniper Networks', 'juniper-networks', 'AI-driven network security and high-performance routing.', 'https://logo.clearbit.com/juniper.net', 'https://www.juniper.net', 'Networking Partner', 2015, 25, 1, NOW(), NOW()),
(26, 'Oracle Autonomous Database', 'oracle-autonomous-database', 'Self-driving, self-securing, self-repairing cloud database.', 'https://logo.clearbit.com/oracle.com', 'https://www.oracle.com/autonomous-database', 'Principal Database & Cloud Partner', 2019, 26, 1, NOW(), NOW()),
(27, 'Apache Kafka', 'apache-kafka', 'Distributed event streaming platform for high-performance data pipelines.', 'https://logo.clearbit.com/kafka.apache.org', 'https://kafka.apache.org', 'Open Source Partner', 2018, 27, 1, NOW(), NOW()),
(28, 'Red Hat', 'red-hat', 'World\'s leading provider of enterprise open source solutions.', 'https://logo.clearbit.com/redhat.com', 'https://www.redhat.com', 'Open Source Enterprise Partner', 2015, 28, 1, NOW(), NOW()),
(29, 'Oracle SOA', 'oracle-soa', 'Service-Oriented Architecture suite for application integration.', 'https://logo.clearbit.com/oracle.com', 'https://www.oracle.com/middleware/technologies/soasuite', 'Principal Integration Partner', 2012, 29, 1, NOW(), NOW()),
(30, '3scale', '3scale', 'Red Hat API management platform for infrastructure scaling.', 'https://logo.clearbit.com/3scale.net', 'https://www.3scale.net', 'API Management Partner', 2017, 30, 1, NOW(), NOW()),
(31, 'Microsoft Hyper-V', 'microsoft-hyper-v', 'Enterprise hardware virtualization hypervisor.', 'https://logo.clearbit.com/microsoft.com', 'https://www.microsoft.com', 'Virtualization Partner', 2014, 31, 1, NOW(), NOW()),
(32, 'Dell EMC', 'dell-emc', 'Enterprise storage, converged infrastructure, and servers.', 'https://logo.clearbit.com/dell.com', 'https://www.dell.com', 'Hardware & Storage Partner', 2015, 32, 1, NOW(), NOW()),
(33, 'Canonical', 'canonical', 'Publisher of Ubuntu, delivering enterprise open-source security.', 'https://logo.clearbit.com/canonical.com', 'https://canonical.com', 'Open Source Partner', 2017, 33, 1, NOW(), NOW()),
(34, 'Informatica', 'informatica', 'Enterprise cloud data management and data integration.', 'https://logo.clearbit.com/informatica.com', 'https://www.informatica.com', 'Data Integration Partner', 2018, 34, 1, NOW(), NOW());
