import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Shared Supabase client. Week 0 used this only to prove the connection
// worked; Week 1 (/core) is the first feature to actually read/write a
// table (core_outputs) through it.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
