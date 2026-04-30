-- MANUALLY CREATE A SUPER ADMIN USER
-- Run this in your Supabase SQL Editor

-- 1. Create the User in Auth System
-- Change 'admin@healthcore.local' and 'password123' to your desired credentials
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@healthcore.local',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Global","last_name":"Admin"}',
  false,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
RETURNING id;

-- 2. After running the above, copy the returned UUID and update the profile
-- (The trigger handle_new_user will automatically create the profile)
-- We just need to give it the SUPER_ADMIN role

UPDATE profiles 
SET role_id = (SELECT id FROM roles WHERE name = 'SUPER_ADMIN')
WHERE email = 'admin@healthcore.local';
