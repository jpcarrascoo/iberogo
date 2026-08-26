import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This file only initializes the Supabase client so the app can prove it's
// wired up correctly. No tables, auth, or queries are added this week —
// that's intentionally out of scope for Week 0 (see README "Scope cuts").
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
