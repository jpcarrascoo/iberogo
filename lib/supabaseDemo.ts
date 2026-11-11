import { supabase } from "./supabaseClient";
import type { DemoRunRow, SavedDemoRun } from "./demo";

// Week 6 reuses the one shared Supabase client (Week 3 lesson).

const NOT_CONFIGURED = "Supabase isn't configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.";
const COLUMNS =
  "id, created_at, tester_label, chat_session_id, order_text, checklist, skipped, plan_choice, minutes_in_line, would_use, usefulness, missing, harm_concern, completed";

export async function saveDemoRun(row: DemoRunRow): Promise<string> {
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("demo_runs").insert(row);
  return error ? `Save failed: ${error.message}. Check that supabase/week6_demo.sql has been run.` : "";
}

/** Newest first. */
export async function fetchDemoRuns(limit = 200): Promise<{ rows: SavedDemoRun[]; error: string }> {
  if (!supabase) return { rows: [], error: NOT_CONFIGURED };
  const { data, error } = await supabase.from("demo_runs").select(COLUMNS).order("created_at", { ascending: false }).limit(limit);
  if (error) return { rows: [], error: `Couldn't load demo runs: ${error.message}` };
  return { rows: (data ?? []) as SavedDemoRun[], error: "" };
}

/** Guardrails triggered in chats that happened inside /demo (for the harm checklist). */
type DemoChat = { id: string; tester_label: string | null; guardrails: string[] | null };

export async function fetchDemoChatGuardrails(): Promise<{ rows: DemoChat[]; error: string }> {
  if (!supabase) return { rows: [], error: NOT_CONFIGURED };
  const { data, error } = await supabase.from("chat_sessions").select("id, tester_label, guardrails").eq("source", "demo").limit(500);
  if (error) return { rows: [], error: `Couldn't load demo chat sessions: ${error.message}` };
  return { rows: (data ?? []) as DemoChat[], error: "" };
}
