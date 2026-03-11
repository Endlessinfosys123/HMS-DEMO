-- HealthCore HMS Demo Data Seed Script
-- Localization: India (INR)
-- This script populates the database with comprehensive demo data.

-- 1. Roles (Essential for system operation)
INSERT INTO roles (name) VALUES 
('ADMIN'), ('DOCTOR'), ('RECEPTIONIST'), ('PATIENT')
ON CONFLICT (name) DO NOTHING;

-- 2. Patients (Realistic Indian Names and Contacts)
INSERT INTO patients (first_name, last_name, email, phone, gender, date_of_birth, blood_group, address, emergency_contact) VALUES
('Arjun', 'Mehta', 'arjun.mehta@hms-demo.com', '9876543210', 'Male', '1985-05-15', 'O+', 'Plot 42, Jubilee Hills, Hyderabad', '9876543211'),
('Priya', 'Sharma', 'priya.sharma@hms-demo.com', '9823456789', 'Female', '1992-08-22', 'A-', 'Building 7, Koramangala, Bengaluru', '9823456790'),
('Rahul', 'Nair', 'rahul.nair@hms-demo.com', '9912345678', 'Male', '1978-03-10', 'B+', 'Apt 204, Powai, Mumbai', '9912345679'),
('Sneha', 'Gupta', 'sneha.gupta@hms-demo.com', '9700011223', 'Female', '2000-11-28', 'AB+', 'Sector 15, Gurgaon, Delhi NCR', '9700011224'),
('Vikram', 'Singh', 'vikram.singh@hms-demo.com', '9600055443', 'Male', '1965-01-05', 'O-', 'Civil Lines, Jaipur', '9600055444'),
('Anjali', 'Desai', 'anjali.desai@hms-demo.com', '9500044332', 'Female', '1988-07-12', 'A+', 'Pali Hill, Bandra West, Mumbai', '9500044333'),
('Karan', 'Verma', 'karan.verma@hms-demo.com', '9400033221', 'Male', '1995-12-30', 'B-', 'Salt Lake City, Sector V, Kolkata', '9400033222')
ON CONFLICT (email) DO NOTHING;

-- 3. Wards & Beds (Hospital Capacity)
INSERT INTO wards (name, type, capacity) VALUES
('Saraswati General Ward', 'GENERAL', 10),
('Shivaji Emergency ICU', 'ICU', 5),
('Mother & Child Ward', 'GENERAL', 8),
('Recovery Unit', 'GENERAL', 6)
ON CONFLICT DO NOTHING;

-- Populate Beds for all wards
INSERT INTO beds (ward_id, bed_number, is_occupied)
SELECT id, 'G-10' || generate_series(1, 10), false FROM wards WHERE name = 'Saraswati General Ward' UNION ALL
SELECT id, 'ICU-0' || generate_series(1, 5), false FROM wards WHERE name = 'Shivaji Emergency ICU' UNION ALL
SELECT id, 'MC-20' || generate_series(1, 8), false FROM wards WHERE name = 'Mother & Child Ward' UNION ALL
SELECT id, 'R-30' || generate_series(1, 6), false FROM wards WHERE name = 'Recovery Unit';

-- 4. Inventory (Comprehensive Medication Catalog)
INSERT INTO inventory (item_name, category, stock_quantity, price, supplier) VALUES
('Paracetamol 500mg', 'Medicine', 1200, 2.50, 'Micro Labs Ltd'),
('Amoxicillin 250mg', 'Medicine', 450, 15.00, 'Sun Pharma'),
('Insulin Glargine', 'Medicine', 85, 450.00, 'Biocon'),
('Cetirizine 10mg', 'Medicine', 2000, 1.20, 'Cipla'),
('Telmisartan 40mg', 'Medicine', 600, 12.00, 'Lupin Ltd'),
('Metformin 500mg', 'Medicine', 1500, 3.50, 'Zydus Cadila'),
('Atorvastatin 10mg', 'Medicine', 800, 8.00, 'Dr. Reddy''s'),
('Disposable Syringes (5ml)', 'Consumable', 5000, 5.00, 'HMD Ltd'),
('N95 Masks (Box 50)', 'Consumable', 100, 1250.00, '3M India'),
('Hand Sanitizer (500ml)', 'Consumable', 350, 150.00, 'Dettol'),
('Vitamin D3 60k IU', 'Medicine', 400, 35.00, 'Abbott India'),
('Surgical Gloves (Pair)', 'Consumable', 1000, 25.00, 'Suru Chemicals');

-- 5. Lab Tests (Diagnostic Services)
INSERT INTO lab_tests (name, description, price) VALUES
('Complete Blood Count (CBC)', 'Standard test to measure blood components', 450.00),
('HbA1c (Diabetes)', 'Measures average blood sugar levels over 3 months', 650.00),
('Chest X-Ray', 'Diagnostic imaging of the thorax', 850.00),
('Kidney Function Test (KFT)', 'Assessment of renal health', 1200.00),
('Liver Function Test (LFT)', 'Evaluation of hepatic enzyme levels', 1100.00),
('Vitamin B12 & D3 Panel', 'Comprehensive vitamin deficiency check', 2200.00),
('ECG (Resting)', 'Monitoring heart rhythm and electrical activity', 550.00),
('Urine Routine', 'Standard urinalysis for infection and markers', 300.00);

-- 6. Sample Lab Orders & Results
-- (Assuming IDs from previous inserts)
INSERT INTO lab_orders (patient_id, test_id, status, result)
SELECT p.id, t.id, 'COMPLETED', 'VAL: 14.2 g/dL | FLAG: NORMAL | NOTES: Hemoglobin is stable.'
FROM patients p, lab_tests t
WHERE p.first_name = 'Arjun' AND t.name = 'Complete Blood Count (CBC)'
LIMIT 1;

INSERT INTO lab_orders (patient_id, test_id, status, result)
SELECT p.id, t.id, 'COMPLETED', 'VAL: 6.8 % | FLAG: HIGH | NOTES: Patient advised diet control.'
FROM patients p, lab_tests t
WHERE p.first_name = 'Priya' AND t.name = 'HbA1c (Diabetes)'
LIMIT 1;

INSERT INTO lab_orders (patient_id, test_id, status)
SELECT p.id, t.id, 'PENDING'
FROM patients p, lab_tests t
WHERE p.first_name = 'Vikram' AND t.name = 'Chest X-Ray'
LIMIT 1;

-- 7. Billing & Financial Transactions
INSERT INTO invoices (patient_id, amount, status, due_date)
SELECT id, 2500.00, 'PAID', (CURRENT_DATE - INTERVAL '5 days') FROM patients WHERE first_name = 'Anjali' LIMIT 1;

INSERT INTO invoices (patient_id, amount, status, due_date)
SELECT id, 850.00, 'UNPAID', (CURRENT_DATE + INTERVAL '10 days') FROM patients WHERE first_name = 'Arjun' LIMIT 1;

INSERT INTO invoices (patient_id, amount, status, due_date)
SELECT id, 12000.00, 'PARTIAL', (CURRENT_DATE + INTERVAL '2 days') FROM patients WHERE first_name = 'Vikram' LIMIT 1;

-- 8. Note on Doctor Data:
-- Doctor profiles in this system are linked to Supabase Auth users for security.
-- To see Doctors in the directory, please:
-- 1. Create users via the "Staff Registry" or Supabase Auth Dashboard.
-- 2. Assign the role "DOCTOR" in the profiles table.
-- Sample record structure (manual insert example):
-- INSERT INTO profiles (id, first_name, last_name, email, role_id, specialization) 
-- VALUES ('<USER_UUID>', 'Siddharth', 'Kapoor', 'dr.sid@hms-demo.com', '<DOCTOR_ROLE_ID>', 'Cardiology');

-- End of Demo Data Script

