# Supabase Database Setup Guide

Follow these steps to connect your local development environment to your Supabase project.

## 1. Create a Supabase Project
- Go to [Supabase](https://supabase.com/) and create a new project.
- Note your `Project URL` and `Anon Key` from **Project Settings > API**.

## 2. Initialize Database Schema
- Open the **SQL Editor** in your Supabase Dashboard.
- Copy the contents of `supabase_schema.sql` (found in the root directory) and run it.
- This will create all tables, set up multi-tenancy (RLS), and configure the user profile trigger.

## 3. Seed Initial Data (Optional)
- Copy the contents of `seed_data.sql` and run it in the SQL Editor.
- This adds initial roles (Doctor, Admin, etc.), lab tests, and inventory items.

## 4. Configure Environment Variables
- In the `frontend` folder, create a `.env` file (if not already present).
- Add your credentials:
  ```env
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

## 5. Enable Email Auth (Important)
- Go to **Authentication > Providers > Email**.
- Ensure **Confirm Email** is enabled (or disabled if you want instant access during testing).

## 6. Local Testing
- Run `npm run dev` in the `frontend` folder.
- Use the **Onboarding** page to register a new clinic and admin user.
