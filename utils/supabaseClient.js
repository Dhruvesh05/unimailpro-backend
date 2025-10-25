// backend/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
