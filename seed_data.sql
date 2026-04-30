-- SEED DATA FOR HEALTHCORE HMS
-- Run this in your Supabase SQL Editor after running supabase_schema.sql

-- 1. Insert Initial Roles
INSERT INTO roles (name) VALUES 
('SUPER_ADMIN'), 
('ADMIN'), 
('DOCTOR'), 
('RECEPTIONIST'), 
('PATIENT')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Demo Lab Tests
INSERT INTO lab_tests (name, description, price) VALUES
('Complete Blood Count (CBC)', 'General health screening', 500.00),
('Lipid Profile', 'Cholesterol and fats screening', 800.00),
('Blood Sugar (Fasting)', 'Diabetes screening', 200.00),
('Thyroid Profile (T3, T4, TSH)', 'Thyroid function test', 1200.00)
ON CONFLICT DO NOTHING;

-- 3. Insert Initial Inventory
INSERT INTO inventory (item_name, category, stock_quantity, price, supplier) VALUES
('Paracetamol 500mg', 'Medicine', 500, 2.50, 'Generic Corp'),
('Amoxicillin 250mg', 'Medicine', 200, 5.00, 'PharmaLink'),
('Disposable Syringe 5ml', 'Consumable', 1000, 1.00, 'MediSupply'),
('Surgical Mask (Box of 50)', 'Consumable', 50, 150.00, 'SafeShield')
ON CONFLICT DO NOTHING;
