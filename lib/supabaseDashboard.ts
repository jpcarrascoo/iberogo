import { supabase } from "./supabaseClient";

// Week 6 /dashboard: read-only. One count + the 5 newest rows per table, through the one shared client.

export type Row = Record<string, unknown> & { id: string; created_at: string };

/** Which columns to show for each table, and how to say a row in one line. */
export const TABLE_VIEWS: Record<string, { columns: string; line: (r: Row) => string }> = {
  core_outputs: {
    columns: "id, created_at, raw_input, pickup_time_raw",
    line: (r) => `"${r.raw_input}"${r.pickup_time_raw ? ` · ${r.pickup_time_raw}` : ""}`,
  },
  research_entries: {
    columns: "id, created_at, title, category",
    line: (r) => `${r.title}${r.category ? ` · ${r.category}` : ""}`,
  },
  pricing_scenarios: {
    columns: "id, created_at, name, scenario, monthly_revenue",
    line: (r) => `${r.name} · ${r.scenario} · $${Number(r.monthly_revenue).toLocaleString("en-US")} MXN/month`,
  },
  marketing_assets: {
    columns: "id, created_at, title, kind, channel",
    line: (r) => `${r.title} · ${r.kind}${r.channel ? ` · ${r.channel}` : ""}`,
  },
  ab_votes: {
    columns: "id, created_at, test_id, choice, variant_text",
    line: (r) => `${r.test_id} · voted ${r.choice}: "${r.variant_text}"`,
  },
  chat_sessions: {
    columns: "id, created_at, tester_label, outcome, guardrails, source",
    line: (r) =>
      `${r.tester_label ?? "Unlabeled"} · ${r.outcome} · from /${r.source ?? "chat"}${
        Array.isArray(r.guardrails) && r.guardrails.length ? ` · ${r.guardrails.length} guardrail(s)` : ""
      }`,
  },
  demo_runs: {
    columns: "id, created_at, tester_label, completed, plan_choice, usefulness",
    line: (r) =>
      `${r.tester_label ?? "Unlabeled"} · ${r.completed ? "completed" : "not completed"} · ${r.plan_choice ?? "no plan"}${
        r.usefulness ? ` · useful ${r.usefulness}/5` : ""
      }`,
  },
};

export async function fetchTable(name: string): Promise<{ count: number | null; rows: Row[]; error: string }> {
  if (!supabase) return { count: null, rows: [], error: "Supabase isn't configured." };
  const view = TABLE_VIEWS[name];
  const { data, error, count } = await supabase
    .from(name)
    .select(view.columns, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) return { count: null, rows: [], error: `Couldn't load ${name}: ${error.message}` };
  return { count: count ?? 0, rows: (data ?? []) as unknown as Row[], error: "" };
}
