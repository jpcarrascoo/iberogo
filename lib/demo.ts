// Week 6 — /demo guided walkthrough: logic.
//
// Pure functions only (no React, no network), so the "Demo logic checks" panel
// runs the same code the page uses.
//
// Instructor feedback on Week 5: testers only placed orders. Nobody asked a question,
// triggered a guardrail or used 👍/👎. So step 3 has a checklist that ticks itself from
// REAL chat events (checklistFromChat). A tester can't tick an item by clicking it;
// they can only skip it, and the skip is saved.

import {
  BANNED_PHRASES,
  PICKUP_POINTS,
  redact,
  runChatChecks,
  runConversation,
  type ChatMessage,
  type ChatState,
} from "./chat";
import { DEMO_EXAMPLE } from "./marketing";
import { TIERS } from "./pricing";
import { AGENT_MAP, ROUTES, TABLES } from "./site";
import { HARM_CHECKLIST } from "./impact";
import { ROADMAP_V2 } from "./roadmap";

/** The demo order with a real pickup point, used in checks and as the step 2 placeholder. */
export const DEMO_ORDER = `${DEMO_EXAMPLE} at building b`;

// --- Steps ---------------------------------------------------------------------------

export const DEMO_STEPS = [
  { id: "problem", title: "The problem" },
  { id: "order", title: "Type an order" },
  { id: "assistant", title: "Talk to the assistant" },
  { id: "plan", title: "Pick a plan" },
  { id: "impact", title: "Would it help you?" },
  { id: "finish", title: "Save your run" },
] as const;

export type DemoStepId = (typeof DEMO_STEPS)[number]["id"];

// All fixed text shown on /demo lives here so the banned-phrase check can scan it.
export const DEMO_COPY = {
  intro:
    "A 5-minute walk through IBEROGO, a student project for ordering food ahead at IBERO. It's a prototype: nothing is sent to a kitchen and nothing is charged.",
  problem: [
    "At peak hours the cafeteria line can take a big part of a short break between classes.",
    "Students told us they want to order the way they'd text a friend, not fill in a long form.",
    "They also want to choose their own pickup time and place, instead of classroom delivery or a priority fee on every order.",
  ],
  problemSource: "From two real student conversations (Sept 14 and Sept 28, 2026) and the Week 2 research.",
  orderTask: "Type an order the way you'd text a friend. Any food is fine.",
  orderNote: "This is the Week 1 order parser: rule-based, no AI API. It only understands English for now.",
  chatTask: "Now use the assistant like you really would. Try to do all 4 things below, in any order and in your own words.",
  chatSafety: "Don't type real personal or card details. If you want to test what the assistant refuses, make something up.",
  planTask: "Which plan would you pick if IBEROGO were real? Plus and Campus Pass are proposals, nothing is charged.",
  impactTask: "Be honest: this is how we find out if IBEROGO is worth building.",
  finishNote: "Saving stores your answers and checklist with your tester label only. No names, no contact details.",
  saved: "Saved. Thank you! Your run now shows on /dashboard.",
};

// --- Step 3 checklist -----------------------------------------------------------------

export type ChecklistKey = "order" | "question" | "guardrail" | "thumbs";
export type Checklist = Record<ChecklistKey, boolean>;

export const CHECKLIST_ITEMS: { key: ChecklistKey; label: string; hint: string }[] = [
  { key: "order", label: "Set up an order", hint: "Get to the order summary (Confirm is even better)." },
  { key: "question", label: "Ask your own question", hint: "Ask something you'd want to know before using it." },
  { key: "guardrail", label: "Test a limit", hint: "Try something you think it shouldn't help with, or should hand to a person." },
  { key: "thumbs", label: "Rate a reply", hint: "Use 👍 or 👎 under any reply (\"Was this helpful?\")." },
];

/** Ticks come only from what really happened in the chat. */
export function checklistFromChat(state: ChatState, messages: ChatMessage[]): Checklist {
  return {
    order: state.confirmed || state.step === "summary" || state.step === "done",
    question: state.faqIntents.length > 0,
    guardrail: state.guardrails.length > 0 || Boolean(state.handoffReason),
    thumbs: messages.some((m) => m.role === "bot" && (m.thumb === "up" || m.thumb === "down")),
  };
}

export function checklistDone(c: Checklist, skipped: ChecklistKey[]): boolean {
  return CHECKLIST_ITEMS.every((i) => c[i.key] || skipped.includes(i.key));
}

// --- Step 4 + 5 ------------------------------------------------------------------------

export const PLAN_CHOICES = [...TIERS.map((t) => t.name), "None of these"] as const;

export type WouldUse = "yes" | "maybe" | "no";

export type Survey = {
  minutes: number | null;
  wouldUse: WouldUse | null;
  usefulness: number | null;
  missing: string;
  harmConcern: string;
};

export const SURVEY_TEXT_MAX = 300;

export const EMPTY_SURVEY: Survey = { minutes: null, wouldUse: null, usefulness: null, missing: "", harmConcern: "" };

export function validateSurvey(s: Survey): string[] {
  const errors: string[] = [];
  if (s.minutes === null || !Number.isInteger(s.minutes) || s.minutes < 0 || s.minutes > 60)
    errors.push("Minutes in line must be a whole number from 0 to 60.");
  if (!s.wouldUse) errors.push("Choose yes, maybe or no.");
  if (s.usefulness === null || !Number.isInteger(s.usefulness) || s.usefulness < 1 || s.usefulness > 5)
    errors.push("Choose a usefulness rating from 1 to 5.");
  if (s.missing.length > SURVEY_TEXT_MAX) errors.push(`"What's missing" must be ${SURVEY_TEXT_MAX} characters or fewer.`);
  if (s.harmConcern.length > SURVEY_TEXT_MAX) errors.push(`"Anything unsafe" must be ${SURVEY_TEXT_MAX} characters or fewer.`);
  return errors;
}

// --- Saved row ---------------------------------------------------------------------------

export type DemoRunRow = {
  tester_label: string | null;
  chat_session_id: string | null;
  order_text: string | null;
  checklist: Checklist;
  skipped: ChecklistKey[];
  plan_choice: string | null;
  minutes_in_line: number | null;
  would_use: WouldUse | null;
  usefulness: number | null;
  missing: string | null;
  harm_concern: string | null;
  completed: boolean;
};

export type SavedDemoRun = DemoRunRow & { id: string; created_at: string };

export function buildDemoRun(input: {
  testerLabel: string;
  chatSessionId: string | null;
  orderText: string;
  checklist: Checklist;
  skipped: ChecklistKey[];
  planChoice: string | null;
  survey: Survey;
}): DemoRunRow {
  const s = input.survey;
  const clean = (t: string, max: number) => redact(t.trim()).slice(0, max) || null;
  return {
    tester_label: clean(input.testerLabel, 40),
    chat_session_id: input.chatSessionId,
    order_text: clean(input.orderText, 500),
    checklist: input.checklist,
    // A skipped item that was ticked anyway counts as done, not skipped.
    skipped: input.skipped.filter((k) => !input.checklist[k]),
    plan_choice: input.planChoice,
    minutes_in_line: s.minutes,
    would_use: s.wouldUse,
    usefulness: s.usefulness,
    missing: clean(s.missing, SURVEY_TEXT_MAX),
    harm_concern: clean(s.harmConcern, SURVEY_TEXT_MAX),
    completed: checklistDone(input.checklist, input.skipped) && validateSurvey(s).length === 0,
  };
}

// --- Testing summary (real runs only) -------------------------------------------------------

export const TESTER_TARGET = 5;
const TESTER_RE = /^tester\s*\d+$/i;

/** "Tester 3" is an external tester; "Software Test 2" or an empty label is not. */
export function isExternalTester(label: string | null): boolean {
  return TESTER_RE.test((label ?? "").trim());
}

export type TestingSummary = {
  testers: number;
  target: number;
  ticked: Record<ChecklistKey, number>;
  skipped: Record<ChecklistKey, number>;
  avgUsefulness: number | null;
  avgMinutes: number | null;
  wouldUse: Record<WouldUse, number>;
  plans: Record<string, number>;
  missing: { tester: string; text: string }[];
  concerns: { tester: string; text: string }[];
};

/**
 * Counts external testers only: runs labeled "Tester 1", "Tester 2"… (not "Software Test 2"),
 * the latest run per label, completed runs only. `runs` must be newest first.
 */
export function testingSummary(runs: Pick<SavedDemoRun, "tester_label" | "checklist" | "skipped" | "plan_choice" | "minutes_in_line" | "would_use" | "usefulness" | "missing" | "harm_concern" | "completed">[]): TestingSummary {
  const seen = new Set<string>();
  const tester = runs.filter((r) => {
    const label = (r.tester_label ?? "").trim();
    if (!r.completed || !TESTER_RE.test(label)) return false;
    const key = label.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const keys: ChecklistKey[] = ["order", "question", "guardrail", "thumbs"];
  const count = (f: (r: (typeof tester)[number]) => boolean) => tester.filter(f).length;
  const avg = (xs: (number | null)[]) => {
    const v = xs.filter((x): x is number => typeof x === "number");
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
  };
  const plans: Record<string, number> = {};
  for (const r of tester) if (r.plan_choice) plans[r.plan_choice] = (plans[r.plan_choice] ?? 0) + 1;
  return {
    testers: tester.length,
    target: TESTER_TARGET,
    ticked: Object.fromEntries(keys.map((k) => [k, count((r) => Boolean(r.checklist?.[k]))])) as Record<ChecklistKey, number>,
    skipped: Object.fromEntries(keys.map((k) => [k, count((r) => (r.skipped ?? []).includes(k))])) as Record<ChecklistKey, number>,
    avgUsefulness: avg(tester.map((r) => r.usefulness)),
    avgMinutes: avg(tester.map((r) => r.minutes_in_line)),
    wouldUse: { yes: count((r) => r.would_use === "yes"), maybe: count((r) => r.would_use === "maybe"), no: count((r) => r.would_use === "no") },
    plans,
    missing: tester.filter((r) => r.missing).map((r) => ({ tester: r.tester_label as string, text: r.missing as string })),
    concerns: tester.filter((r) => r.harm_concern).map((r) => ({ tester: r.tester_label as string, text: r.harm_concern as string })),
  };
}

// --- Demo logic checks (shown on /demo and in Site health) -------------------------------------

export type DemoCheck = { name: string; expected: string; actual: string; pass: boolean };

const SITE_BANNED: RegExp[] = [
  ...BANNED_PHRASES,
  /\b(order|pay) now\b/i,
  /\bavailable now\b/i,
  /\b(is|the|an) official (ibero|universidad)/i,
];

function botMessages(replies: { text: string }[], thumb: ChatMessage["thumb"] = null): ChatMessage[] {
  return replies.map((r, i) => ({ id: i, role: "bot", text: r.text, thumb }));
}

const tickText = (c: Checklist) =>
  (Object.keys(c) as ChecklistKey[]).filter((k) => c[k]).join(", ") || "none";

export function allDemoCopy(): string[] {
  return [
    ...Object.values(DEMO_COPY).flat(),
    ...CHECKLIST_ITEMS.flatMap((i) => [i.label, i.hint]),
    ...HARM_CHECKLIST.flatMap((h) => [h.mitigation]),
    ...ROADMAP_V2.flatMap((r) => [r.title, r.why]),
    ...AGENT_MAP.map((a) => a.does),
  ];
}

export function runDemoChecks(): DemoCheck[] {
  const checks: DemoCheck[] = [];

  // 1. Nothing is ticked before the tester does anything
  const fresh = runConversation([]);
  const c1 = checklistFromChat(fresh.state, []);
  checks.push({
    name: "1. A fresh chat ticks nothing",
    expected: "none",
    actual: tickText(c1),
    pass: tickText(c1) === "none",
  });

  // 2. Order tick comes from reaching the summary
  const order = runConversation([DEMO_ORDER, "Yes"]);
  const c2 = checklistFromChat(order.state, botMessages(order.replies));
  checks.push({
    name: "2. Reaching the order summary ticks only \"order\"",
    expected: `order (pickup ${PICKUP_POINTS[1]})`,
    actual: `${tickText(c2)} (pickup ${order.state.pickupPoint ?? "none"})`,
    pass: tickText(c2) === "order" && order.state.pickupPoint === PICKUP_POINTS[1],
  });

  // 3. A real question ticks "question"
  const q = runConversation(["Is this official IBERO?"]);
  const c3 = checklistFromChat(q.state, botMessages(q.replies));
  checks.push({
    name: "3. Asking a question ticks \"question\"",
    expected: "question",
    actual: tickText(c3),
    pass: tickText(c3) === "question",
  });

  // 4. A guardrail ticks "guardrail"
  const g = runConversation(["I'm allergic to peanuts"]);
  const c4 = checklistFromChat(g.state, botMessages(g.replies));
  checks.push({
    name: "4. Triggering a guardrail ticks \"guardrail\"",
    expected: "guardrail",
    actual: tickText(c4),
    pass: tickText(c4) === "guardrail",
  });

  // 5. 👍/👎 ticks "thumbs"
  const c5 = checklistFromChat(fresh.state, botMessages([{ text: "hi" }], "down"));
  checks.push({
    name: "5. Using 👍/👎 ticks \"thumbs\"",
    expected: "thumbs",
    actual: tickText(c5),
    pass: tickText(c5) === "thumbs",
  });

  // 6. Free text is redacted before saving; skipped-but-done isn't counted as skipped
  const row = buildDemoRun({
    testerLabel: "Tester 9 jose@example.com",
    chatSessionId: null,
    orderText: "2 tacos",
    checklist: { order: true, question: true, guardrail: false, thumbs: false },
    skipped: ["question", "thumbs"],
    planChoice: "Plus",
    survey: { minutes: 15, wouldUse: "yes", usefulness: 4, missing: "card 4242 4242 4242 4242 menu", harmConcern: "call 55 1234 5678" },
  });
  checks.push({
    name: "6. Survey text is redacted; a done item isn't saved as skipped",
    expected: "[card number removed] · [phone removed] · [email removed] · skipped: thumbs",
    actual: `${row.missing} · ${row.harm_concern} · ${row.tester_label} · skipped: ${row.skipped.join(", ")}`,
    pass:
      Boolean(row.missing?.includes("[card number removed]")) &&
      Boolean(row.harm_concern?.includes("[phone removed]")) &&
      Boolean(row.tester_label?.includes("[email removed]")) &&
      !/\d{4}/.test(`${row.missing}${row.harm_concern}`) &&
      row.skipped.join(",") === "thumbs",
  });

  // 7. Survey validation
  const bad = validateSurvey({ minutes: 90, wouldUse: null, usefulness: 7, missing: "x".repeat(SURVEY_TEXT_MAX + 1), harmConcern: "" });
  const good = validateSurvey({ minutes: 10, wouldUse: "maybe", usefulness: 3, missing: "", harmConcern: "" });
  checks.push({
    name: "7. Survey answers are validated",
    expected: "bad answers → 4 errors · good answers → 0",
    actual: `bad answers → ${bad.length} errors · good answers → ${good.length}`,
    pass: bad.length === 4 && good.length === 0,
  });

  // 8. Testing summary math on a fixed sample
  const base = { skipped: [] as ChecklistKey[], plan_choice: "Plus", minutes_in_line: 10, would_use: "yes" as WouldUse, usefulness: 4, missing: null, harm_concern: null, completed: true };
  const all = { order: true, question: true, guardrail: true, thumbs: true };
  const sample = [
    { ...base, tester_label: "Tester 2", checklist: all, usefulness: 5, minutes_in_line: 20 },
    { ...base, tester_label: "Tester 1", checklist: { ...all, thumbs: false }, skipped: ["thumbs" as ChecklistKey], would_use: "maybe" as WouldUse, plan_choice: "Basic" },
    { ...base, tester_label: "tester 2", checklist: all, usefulness: 1 }, // older duplicate: ignored
    { ...base, tester_label: "Software Test 2", checklist: all }, // not an external tester: ignored
    { ...base, tester_label: "Tester 3", checklist: all, completed: false }, // unfinished: ignored
  ];
  const sum = testingSummary(sample);
  checks.push({
    name: "8. Testing summary counts each real tester once",
    expected: "2 testers · thumbs 1 (1 skipped) · usefulness 4.5 · minutes 15 · yes 1 maybe 1",
    actual: `${sum.testers} testers · thumbs ${sum.ticked.thumbs} (${sum.skipped.thumbs} skipped) · usefulness ${sum.avgUsefulness} · minutes ${sum.avgMinutes} · yes ${sum.wouldUse.yes} maybe ${sum.wouldUse.maybe}`,
    pass:
      sum.testers === 2 &&
      sum.ticked.thumbs === 1 &&
      sum.skipped.thumbs === 1 &&
      sum.avgUsefulness === 4.5 &&
      sum.avgMinutes === 15 &&
      sum.wouldUse.yes === 1 &&
      sum.wouldUse.maybe === 1,
  });

  // 9. Navigation and agent map point to real pages and tables
  const hrefs = ROUTES.map((r) => r.href);
  const tableNames = TABLES.map((t) => t.name);
  const badLinks = AGENT_MAP.filter((a) => !hrefs.includes(a.href)).map((a) => a.href);
  const badTables = AGENT_MAP.flatMap((a) => a.writesTo).filter((t) => !tableNames.includes(t));
  const required = ["/demo", "/dashboard", "/docs"];
  checks.push({
    name: "9. Every page is in the navigation; agent map links are real",
    expected: `${hrefs.length} unique routes incl. /demo, /dashboard, /docs · 0 bad links · 0 unknown tables`,
    actual: `${new Set(hrefs).size} unique routes${required.every((h) => hrefs.includes(h)) ? " incl. /demo, /dashboard, /docs" : " (missing a required page)"} · ${badLinks.length} bad links · ${badTables.length} unknown tables`,
    pass: new Set(hrefs).size === hrefs.length && required.every((h) => hrefs.includes(h)) && badLinks.length === 0 && badTables.length === 0,
  });

  // 10. Every harm row has a passing check behind it; every V2 item has evidence
  const chat = runChatChecks();
  const harmOk = HARM_CHECKLIST.filter((h) => {
    if (h.evidence.suite === "demo") return h.evidence.number === 6 && checks[5].pass;
    const c = chat.find((x) => x.name.startsWith(`${h.evidence.number}.`));
    return Boolean(c?.pass);
  });
  const roadmapOk = ROADMAP_V2.filter((r) => r.why.trim() && r.source.trim());
  checks.push({
    name: "10. Every harm has a passing check; every V2 item has evidence",
    expected: `${HARM_CHECKLIST.length} of ${HARM_CHECKLIST.length} harms · ${ROADMAP_V2.length} of ${ROADMAP_V2.length} V2 items`,
    actual: `${harmOk.length} of ${HARM_CHECKLIST.length} harms · ${roadmapOk.length} of ${ROADMAP_V2.length} V2 items`,
    pass: harmOk.length === HARM_CHECKLIST.length && roadmapOk.length === ROADMAP_V2.length,
  });

  // 11. No demo text claims real orders, payments or IBERO affiliation
  const copy = allDemoCopy();
  const hits = copy.filter((t) => SITE_BANNED.some((re) => re.test(t)));
  checks.push({
    name: "11. No demo, impact or roadmap text claims a real order, payment or affiliation",
    expected: `0 of ${copy.length} texts`,
    actual: hits.length ? `${hits.length}: "${hits[0].slice(0, 50)}…"` : `0 of ${copy.length} texts`,
    pass: hits.length === 0,
  });

  return checks;
}
