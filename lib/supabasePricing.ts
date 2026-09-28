import { supabase } from "./supabaseClient";

// Week 3 fix: reuse the one shared Supabase client from Week 1 instead of
// creating a second one. Two clients caused the console warning
// "Multiple GoTrueClient instances detected" on /pricing.
export function getPricingDb() {
  return supabase;
}
