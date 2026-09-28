import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Uses the same env vars as Weeks 1–2. NEXT_PUBLIC_SUPABASE_URL must be the bare
// project URL (https://xxxx.supabase.co), with no /rest/v1/ suffix.
let client: SupabaseClient | null = null;

export function getPricingDb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
