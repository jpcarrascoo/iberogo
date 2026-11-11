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

export const REGRESSION_DATE: string | null = null;

export const REGRESSION: RegressionRow[] = [
  { route: "/", mainAction: "Landing page opens in English; ES toggle works; CTA opens /demo", result: null, note: null },
  { route: "/demo", mainAction: "All 6 steps; checklist ticks; run saves and appears on /dashboard", result: null, note: null },
  { route: "/core", mainAction: "Parse an example order and save it", result: null, note: null },
  { route: "/chat", mainAction: "Golden path to Confirm at a Building pickup point, rate, save", result: null, note: null },
  { route: "/pricing", mainAction: "Change a scenario and save it", result: null, note: null },
  { route: "/product", mainAction: "Feature table loads", result: null, note: null },
  { route: "/research", mainAction: "Filter competitors (\"Coco\" → 1 row) and save a note", result: null, note: null },
  { route: "/marketing", mainAction: "Copy a post, record an A/B vote", result: null, note: null },
  { route: "/dashboard", mainAction: "Every table count matches Supabase; Site health all PASS", result: null, note: null },
  { route: "/docs", mainAction: "Prompt library copy button; build logs and agent map show", result: null, note: null },
];

export const REGRESSION_ALSO_CHECKED = [
  "Zero console errors on the page",
  "Reachable from the navbar on desktop and the mobile menu (375 px wide, no sideways scrolling)",
  "Opens in English",
];
