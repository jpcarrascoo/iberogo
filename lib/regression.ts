// Week 6 — full-site regression test (manual half; the automatic half is Site health on /dashboard).
//
// One row per page, run on the PRODUCTION URL. `result` stays null ("Not run yet")
// until the test is really done. Never filled in with an assumed result.

export type RegressionRow = {
  route: string;
  mainAction: string;
  result: "PASS" | "FAIL" | null;
  note: string | null;
};

export const REGRESSION_DATE: string | null = "Nov 14, 2026";

export const REGRESSION: RegressionRow[] = [
  { route: "/", mainAction: "Landing page opens in English; ES toggle works; CTA opens /demo", result: "PASS", note: "ES/EN toggle switches the page; \"Try the 5-minute demo\" opens /demo. The demo order bubble stays English in ES (the parser is English-only, Week 4 decision)." },
  { route: "/demo", mainAction: "All 6 steps; checklist ticks; run saves and appears on /dashboard", result: "PASS", note: "Software Test 2: all 4 boxes ticked from real chat events; run saved and linked to its chat session (source demo, handoff)." },
  { route: "/core", mainAction: "Parse an example order and save it", result: "PASS", note: "Example 1 parsed (2× Tacos, no onions · 1× Coke · 1:00 PM) and saved; core_outputs 9 → 10." },
  { route: "/chat", mainAction: "Golden path to Confirm at a Building pickup point, rate, save", result: "PASS", note: "\"1 coffee at 12 at building c\" → Confirm → rated 5 → saved as \"Regression\"; chat_sessions 7 → 8." },
  { route: "/pricing", mainAction: "Change a scenario and save it", result: "PASS", note: "Adoption changed to 6.5% → $29,750.50/month, saved as \"Regression\"; pricing_scenarios 3 → 4. Pricing checks 2/2." },
  { route: "/product", mainAction: "Feature table loads", result: "PASS", note: "Feature table loads (4 built, the rest marked Planned)." },
  { route: "/research", mainAction: "Filter competitors (\"Coco\" → 1 row) and save a note", result: "PASS", note: "\"coco\" → 1 of 10 shown; note \"Regression\" saved; research_entries 3 → 4." },
  { route: "/marketing", mainAction: "Copy a post, record an A/B vote", result: "PASS", note: "Copy on P1 → \"Copied ✓\"; AB1 vote saved; ab_votes 5 → 6." },
  { route: "/dashboard", mainAction: "Every table count matches Supabase; Site health all PASS", result: "PASS", note: "Software Test 3: all 7 counts matched the Supabase Table Editor; card number saved as \"[card number removed]\"; Site health 44/44." },
  { route: "/docs", mainAction: "Prompt library copy button; build logs and agent map show", result: "PASS", note: "Copy prompt → \"Copied ✓\"; 10 prompts, 7 build logs and the agent map show." },
];

export const REGRESSION_ALSO_CHECKED = [
  "Zero console errors on the page",
  "Reachable from the navbar on desktop and the mobile menu (375 px wide, no sideways scrolling)",
  "Opens in English",
];
