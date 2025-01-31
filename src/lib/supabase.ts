import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://oposzxydezhxnqrphogu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wb3N6eHlkZXpoeG5xcnBob2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjM2MzksImV4cCI6MjA1MDE5OTYzOX0.BfKx5L-TYv13vifHPdmyQBhtg4_3MEQxhEHdP7tLPGM";

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey
);