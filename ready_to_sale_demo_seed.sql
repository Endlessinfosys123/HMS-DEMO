-- HMS Ready-to-Sale Demo Seed Data
-- Run this in your Supabase SQL Editor to populate the demo environment.

-- 1. Create a Demo Clinic if not exists
INSERT INTO clinics (id, name, contact_email, subscription_tier, subscription_status)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'HealthCore General Hospital', 'demo@healthcore.com', 'PRO', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Lab Tests for the Demo Clinic
INSERT INTO lab_tests (clinic_id, name, description, price)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'Complete Blood Count (CBC)', 'Basic blood panel', 450.00),
  ('d0000000-0000-0000-0000-000000000001', 'Lipid Profile', 'Cholesterol and triglycerides', 850.00),
  ('d0000000-0000-0000-0000-000000000001', 'Liver Function Test (LFT)', 'Liver enzyme screening', 1200.00),
  ('d0000000-0000-0000-0000-000000000001', 'Blood Sugar (Fasting)', 'Glucose monitoring', 150.00),
  ('d0000000-0000-0000-0000-000000000001', 'X-Ray Chest PA View', 'Radiology imaging', 600.00)
ON CONFLICT DO NOTHING;

-- 3. Seed Pharmacy Inventory
INSERT INTO inventory (clinic_id, item_name, category, stock_quantity, price, supplier)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'Amoxicillin 500mg', 'Antibiotics', 500, 120.00, 'MediPharma Inc'),
  ('d0000000-0000-0000-0000-000000000001', 'Paracetamol 650mg', 'Analgesics', 1000, 30.00, 'Global Health'),
  ('d0000000-0000-0000-0000-000000000001', 'Metformin 500mg', 'Antidiabetic', 300, 85.00, 'MediPharma Inc'),
  ('d0000000-0000-0000-0000-000000000001', 'Atorvastatin 10mg', 'Cardiovascular', 200, 150.00, 'Global Health'),
  ('d0000000-0000-0000-0000-000000000001', 'Surgical Masks (Box)', 'Consumables', 50, 250.00, 'Local Supply')
ON CONFLICT DO NOTHING;

-- 4. Seed Sample Patients
INSERT INTO patients (clinic_id, first_name, last_name, gender, date_of_birth, phone, blood_group, address)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'Amit', 'Sharma', 'Male', '1985-06-15', '9876543210', 'O+', 'Sector 15, Dwarka, New Delhi'),
  ('d0000000-0000-0000-0000-000000000001', 'Priya', 'Patel', 'Female', '1992-03-22', '9898989898', 'B+', 'Navrangpura, Ahmedabad, Gujarat'),
  ('d0000000-0000-0000-0000-000000000001', 'Rahul', 'Verma', 'Male', '1978-11-05', '9000011111', 'A-', 'Andheri East, Mumbai, Maharashtra')
ON CONFLICT DO NOTHING;

-- 5. Seed Wards and Beds
INSERT INTO wards (id, clinic_id, name, type, capacity)
VALUES 
  ('w0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'General Ward A', 'GENERAL', 10),
  ('w0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'ICU North', 'ICU', 5)
ON CONFLICT DO NOTHING;

INSERT INTO beds (clinic_id, ward_id, bed_number, is_occupied)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'w0000000-0000-0000-0000-000000000001', 'GW-101', false),
  ('d0000000-0000-0000-0000-000000000001', 'w0000000-0000-0000-0000-000000000001', 'GW-102', false),
  ('d0000000-0000-0000-0000-000000000001', 'w0000000-0000-0000-0000-000000000002', 'ICU-1', false)
ON CONFLICT DO NOTHING;
