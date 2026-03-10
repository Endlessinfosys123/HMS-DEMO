import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase env vars missing. Check your backend .env file.');
}

// Use the service role key on the backend for full access (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
