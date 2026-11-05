import { supabase } from "./supabaseClient";
import type { GuardrailId, Outcome, SessionRow } from "./chat";

// Week 5 reuses the one shared Supabase client (Week 3 lesson).

export type SavedSession = {
  id: string;
  created_at: string;
  tester_label: string | null;
  outcome: Outcome;
  handoff_reason: string | null;
  guardrails: GuardrailId[];
  thumbs_up: number;
  thumbs_down: number;
  rating: number | null;
  comment: string | null;
  transcript: SessionRow["transcript"];
};

const NOT_CONFIGURED = "Supabase isn't configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.";
const COLUMNS = "id, created_at, tester_label, outcome, handoff_reason, guardrails, thumbs_up, thumbs_down, rating, comment, transcript";

export async function saveSession(row: SessionRow): Promise<string> {
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("chat_sessions").insert(row);
  return error ? `Save failed: ${error.message}. Check that the chat_sessions table and its RLS policies exist.` : "";
}

export async function fetchSessions(opts: { handoffOnly?: boolean; limit?: number } = {}): Promise<{ rows: SavedSession[]; error: string }> {
  if (!supabase) return { rows: [], error: NOT_CONFIGURED };
  let q = supabase.from("chat_sessions").select(COLUMNS).order("created_at", { ascending: false }).limit(opts.limit ?? 8);
  if (opts.handoffOnly) q = q.eq("outcome", "handoff");
  const { data, error } = await q;
  if (error) return { rows: [], error: `Couldn't load chat sessions: ${error.message}` };
  return { rows: (data ?? []) as SavedSession[], error: "" };
}
