import { supabase } from "./supabaseClient";

// Week 4 reuses the one shared Supabase client (the Week 3 lesson: a second
// createClient() caused "Multiple GoTrueClient instances detected").

export type AssetKind = "post" | "script" | "copy" | "custom";

export type SavedAsset = {
  id: string;
  created_at: string;
  kind: AssetKind;
  asset_id: string | null;
  title: string;
  channel: string | null;
  body: string;
};

export type Vote = {
  id: string;
  created_at: string;
  test_id: string;
  choice: "A" | "B";
  reason: string | null;
};

const NOT_CONFIGURED = "Supabase isn't configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.";

export async function saveAsset(input: {
  kind: AssetKind;
  asset_id?: string | null;
  title: string;
  channel?: string | null;
  body: string;
}): Promise<string> {
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("marketing_assets").insert({
    kind: input.kind,
    asset_id: input.asset_id ?? null,
    title: input.title,
    channel: input.channel ?? null,
    body: input.body,
  });
  return error ? `Save failed: ${error.message}. Check that the marketing_assets table and its RLS policies exist.` : "";
}

export async function fetchAssets(limit = 8): Promise<{ rows: SavedAsset[]; error: string }> {
  if (!supabase) return { rows: [], error: NOT_CONFIGURED };
  const { data, error } = await supabase
    .from("marketing_assets")
    .select("id, created_at, kind, asset_id, title, channel, body")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { rows: [], error: `Couldn't load saved assets: ${error.message}` };
  return { rows: (data ?? []) as SavedAsset[], error: "" };
}

export async function recordVote(input: {
  test_id: string;
  choice: "A" | "B";
  variant_text: string;
  reason: string;
}): Promise<string> {
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("ab_votes").insert({
    test_id: input.test_id,
    choice: input.choice,
    variant_text: input.variant_text,
    reason: input.reason.trim() || null,
  });
  return error ? `Vote not saved: ${error.message}. Check that the ab_votes table and its RLS policies exist.` : "";
}

export async function fetchVotes(): Promise<{ rows: Vote[]; error: string }> {
  if (!supabase) return { rows: [], error: NOT_CONFIGURED };
  const { data, error } = await supabase
    .from("ab_votes")
    .select("id, created_at, test_id, choice, reason")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return { rows: [], error: `Couldn't load A/B votes: ${error.message}` };
  return { rows: (data ?? []) as Vote[], error: "" };
}
