// Week 6 — /docs data: the coding-agent prompt library and the week-by-week build logs.
//
// Prompts are copied word for word from each week's Build Discipline Packet. Where a week's
// exact prompt text isn't kept in the repo, the entry says where it is instead of rewriting it.

export type CodingPrompt = {
  id: string;
  week: string;
  purpose: string;
  prompt: string | null; // null = exact text kept in that week's submission document, not rewritten here
  result: string;
  commits: string[];
};

export const PROMPTS: CodingPrompt[] = [
  {
    id: "W1-main",
    week: "Week 1",
    purpose: "Build /core: the order parser, output card and Supabase save",
    prompt: null,
    result: "lib/parseOrder.ts, /core page, core_outputs table",
    commits: ["9b11b2f", "05c4935", "a9b0532", "b6d1dbe", "b5eab10", "ebacdd6"],
  },
  {
    id: "W2-main",
    week: "Week 2",
    purpose: "Build /research: benchmark cards, competitor table, risk map, research notes",
    prompt: null,
    result: "lib/research.ts, /research page, research_entries table",
    commits: ["d5a5e9a", "74cd78b", "425f387", "24197a4", "ff9792d"],
  },
  {
    id: "W3-main",
    week: "Week 3",
    purpose: "Build /product and /pricing: feature map, tiers, revenue simulator",
    prompt: null,
    result: "lib/pricing.ts, lib/product.ts, /product and /pricing, pricing_scenarios table",
    commits: ["3ab36ed", "0f5b76b", "d4dd7e0", "c973d0b", "e4093d4", "31ec675", "7394ea8"],
  },
  {
    id: "W4-main",
    week: "Week 4",
    purpose: "Build /marketing and turn the homepage into a landing page",
    prompt:
      "Implement ONLY the Week 4 scope below in the existing IBEROGO Next.js repo (App Router, Tailwind v4, shared Supabase client in lib/supabaseClient.ts). Create lib/brand.ts (brand tokens, voice rules, contrastRatio()) and lib/marketing.ts (persona, LANDING copy ES/EN, HOMEPAGE_HEADLINE, 10 POSTS, 3 SCRIPTS, 14-day CALENDAR referencing post/script ids, 2 AB_TESTS, and pure functions abSummary, calendarWithDates, toMarkdown, calendarCsv, runMarketingChecks). Create components/marketing/* (BrandSystem, PersonaCard, LandingCopy, ContentCards with channel filter + Copy + Save, CampaignCalendar with start-date input + CSV export, ABTester writing to ab_votes, SavedAssets with a draft form writing to marketing_assets, MarketingChecks, CopyButton) and app/marketing/page.tsx. Replace the homepage hero with a client LandingHome component (ES/EN toggle) that reads LANDING; keep ResearchWidget, PricingWidget and Roadmap under a 'Build log' heading and add a MarketingWidget. Add /marketing to the navbar (scrollable on mobile), fix the footer GitHub link to jpcarrascoo/iberogo and add a non-affiliation line, add a Week 4 /docs entry, set Week 4 to In progress on the roadmap. Add supabase/week4_marketing.sql (marketing_assets, ab_votes, anon insert/select RLS). Do NOT add: npm dependencies, AI/LLM API calls, social-media APIs, auth, payments, or any invented testimonial, statistic or A/B result. All copy must be honest that IBEROGO is a prototype with no real ordering or payments yet. Must pass npm run lint and npm run build.",
    result: "lib/brand.ts, lib/marketing.ts, /marketing, homepage landing page, marketing_assets + ab_votes tables",
    commits: ["01186f2", "94e661d", "2c22fc0", "270a710", "138ea1f", "bae7e2d"],
  },
  {
    id: "W5-main",
    week: "Week 5",
    purpose: "Build /chat: the guided assistant with intake, FAQ, guardrails, confirm step and hand-off; English by default",
    prompt:
      "Implement ONLY the Week 5 scope below in the existing IBEROGO Next.js repo (App Router, Tailwind v4, shared Supabase client in lib/supabaseClient.ts). Create lib/chat.ts: a pure, rule-based chat state machine with respond(state, message) → { replies, nextState, flags }, a 3-step intake (order text parsed by the existing parseOrderText; pickup time, skipped with a confirmation if already parsed; pickup point from a PICKUP_POINTS list), a summary step that requires an explicit Confirm or Edit, ≥7 FAQ intents answered from LANDING.faq and lib/pricing.ts, guardrails G1–G8 (allergy → hand-off, card number with Luhn check → refuse + redact, email/phone → warn + redact, off-topic redirect, abusive language boundary, over-claim honesty, talk-to-human → hand-off, >500 chars), hand-off after 2 consecutive unknown messages, redact(), and runChatChecks() returning ~12 named PASS/FAIL checks including a banned-phrase scan over all reply templates. Create lib/supabaseChat.ts (saveSession, fetchSessions, fetchHandoffs) and supabase/week5_chat_sessions.sql (chat_sessions table, anon insert + select RLS). Create components/chat/* (ChatWindow, MessageBubble with thumbs up/down, SummaryCard, SessionFeedback with 1–5 rating, comment, tester label and Save test summary, RecentSessions, HandoffList, ChatChecks, ExternalTests placeholder) and app/chat/page.tsx, with the 'Simulated assistant, rule-based, no AI API, prototype' label and privacy notice. Add /chat to the navbar. Then, in a separate commit, make English the default: LandingHome opens in 'en', /marketing shows full English copy for landing blocks, 10 posts and 3 scripts as primary with Spanish behind an optional toggle, rename the 'Básico' tier to 'Basic' in English UI, and translate any remaining Spanish UI text. Add a Week 5 homepage widget, /docs entry and roadmap status. Do NOT add: npm dependencies, AI/LLM API calls, auth, payments, real order submission, live human chat, or any invented test result, testimonial or statistic. All text must be English by default. Must pass npm run lint and npm run build.",
    result: "lib/chat.ts, /chat, chat_sessions table, English default site-wide",
    commits: ["8956819", "ccbeb37", "b87405b", "a24b976"],
  },
  {
    id: "W5-fix",
    week: "Week 5",
    purpose: "Fix the 3 bugs found in testing (2 in Software Test 3, 1 from External Tester 2)",
    prompt: null,
    result: "dropSensitiveClauses, strict parseTimeAnswer, cleanOrderText + extractPickupPoint; chat checks 15–17",
    commits: ["1a47613", "c1c1e97"],
  },
  {
    id: "W6-main",
    week: "Week 6",
    purpose: "Integrate the venture: navigation, /demo, /dashboard, agent map, impact check, V2 roadmap, /docs",
    prompt:
      "Implement ONLY the Week 6 scope below in the existing IBEROGO Next.js repo (App Router, Tailwind v4, shared Supabase client in lib/supabaseClient.ts; existing lib/parseOrder.ts, lib/chat.ts, lib/pricing.ts, components/chat/*; existing tables core_outputs, research_entries, pricing_scenarios, marketing_assets, ab_votes, chat_sessions). (1) Create lib/site.ts with ROUTES (label, href, group: Product/Venture/Build) and AGENT_MAP (id, name, week, kind: 'real logic'|'simulated / rule-based'|'AI-assisted, human-reviewed', href, writesTo table). Replace the navbar and footer with shared Navbar (active state + a simple mobile menu, no animation library) and Footer that render from ROUTES; add a 'Try the demo' CTA. (2) In lib/chat.ts set PICKUP_POINTS to Building A, Building B, Building C, Building D and PICKUP_POINTS_ARE_EXAMPLES to false, update the pickup FAQ answer, make extractPickupPoint understand 'building a' / 'bldg a' / 'edificio a', update the check that used 'main cafeteria' and add a check that an unknown place falls back to Q3; return matched FAQ intents in flags without changing guardrail behavior; add a visible 'Was this helpful?' label to 👍/👎; save faq_intents and source ('chat'|'demo') in chat_sessions and return the inserted id. All existing chat checks must still pass. (3) Create supabase/week6_demo.sql: demo_runs table (id, created_at, tester_label, chat_session_id references chat_sessions, order_text, checklist jsonb, skipped text[], plan_choice, minutes_in_line int 0–60, would_use in ('yes','maybe','no'), usefulness int 1–5, missing, harm_concern, completed) with anon insert + select RLS; alter chat_sessions add faq_intents text[] default '{}' and source text default 'chat'. (4) Create lib/demo.ts (checklistFromChat, validateSurvey, testingSummary, runDemoChecks ~10 named PASS/FAIL checks incl. a banned-phrase scan), lib/impact.ts (HARM_CHECKLIST rows: risk, mitigation, evidence check, plus impactSummary), lib/roadmap.ts (V2 items with why/evidence and size), lib/docs.ts (prompt library Weeks 1–6 and per-week build logs), lib/supabaseDemo.ts and lib/supabaseDashboard.ts. (5) Create app/demo/page.tsx with a 6-step stepper (problem, order via parseOrderText, embedded ChatWindow with a 4-item checklist that ticks only from real chat state/flags with an explicit recorded Skip, plan choice from lib/pricing.ts, impact survey with redact() on free text, finish + 'Save my demo run'), plus AgentMap (Tailwind boxes and arrows, labels, links), ImpactCheck, RoadmapV2, DemoChecks, and a 'Don't type real personal or card details' notice. (6) Create app/dashboard/page.tsx: read-only count + 5 latest rows for core_outputs, research_entries, pricing_scenarios, marketing_assets, ab_votes, chat_sessions, demo_runs; Needs human review; TestingSummary from real demo_runs showing '0 of 5, not tested yet' when empty; SiteHealth running every existing run*Checks suite. (7) Upgrade /docs with PromptLibrary (copy buttons), BuildLogs and AgentMap; add a Week 6 homepage widget, roadmap status and a 'Try the 5-minute demo' hero CTA. Do NOT add: npm dependencies, AI/LLM API calls, auth, payments, real order submission, edit/delete of records, analytics/tracking scripts, or any invented test result, testimonial or statistic. All text English by default. Must pass npm run lint and npm run build.",
    result: "lib/site.ts, lib/demo.ts, lib/impact.ts, lib/roadmap.ts, lib/docs.ts, /demo, /dashboard, demo_runs table",
    commits: ["2b8eb9c", "49462b3", "404a04c", "7369d89"],
  },
  {
    id: "W6-unknown-place",
    week: "Week 6",
    purpose: "Fix found while building: a place that isn't a pickup point was read as part of the food",
    prompt:
      "\"a margherita pizza at 1pm by the main cafeteria\" now becomes one item called \"Margherita Pizza By The Main Cafeteria\", because \"main cafeteria\" is no longer a pickup point. Take a place that isn't a pickup point out of the order text, don't guess a point, tell the student it isn't one of the pickup points and ask question 3. Extend check 18 so it fails if the item name still contains the place.",
    result: "UNKNOWN_PLACE_RE + q3UnknownPlace reply; chat check 18",
    commits: ["49462b3"],
  },
  {
    id: "W6-real-testers",
    week: "Week 6",
    purpose: "Keep builder tests out of the impact numbers",
    prompt:
      "In the harm table, \"Hit by a real tester\" must count only chats saved from /demo with an external tester label (\"Tester 1\"…), never the builder's software tests (\"Software Test 2\"). Reuse the same label rule as the testing summary.",
    result: "isExternalTester() used by the testing summary and the harm table",
    commits: ["404a04c"],
  },
  {
    id: "W6-tester-fix",
    week: "Week 6",
    purpose: "Fix what the 5 external testers ran into (Nov 18, 2026)",
    prompt:
      "Fix only these, using the testers' exact words as logic checks, and keep the Week 1 parser unchanged: (1) Tester 2 asked \"Do you have the menus from all the restaurants?\" and Tester 3 asked \"How do i order?\"; both got \"I'm not sure\" and the /demo \"Ask your own question\" box didn't tick (0 of 5 testers got it). Add a menu answer and match \"how do I order\"; a real question with no answer must still count as asked, be saved for the builder, and get an honest reply. (2) Tester 5's \"one peperoni pizza, but with no cheese and just a little bit of sauce\" became 3 items; changes like that must be notes on the item. (3) \"Can I pay with cash?\" must not be read as an order, while \"can I get 2 tacos\" still is. Then re-rank the V2 roadmap from the testers' answers.",
    result: "menu FAQ, how-to-order match, unansweredQuestions, mergeModifierItems/parseChatOrder; chat checks 20–21, demo check 3b; V2 roadmap re-ranked",
    commits: [],
  },
  {
    id: "W6-regression",
    week: "Week 6",
    purpose: "Make sure no page is left out of the full-site regression test",
    prompt:
      "Add a manual regression table (one row per page, result 'Not run yet' until really run on production) to /dashboard, and make demo check 9 fail if any route in ROUTES has no regression row.",
    result: "lib/regression.ts, Full-site regression table, demo check 9",
    commits: ["7369d89"],
  },
];

// --- Build logs ----------------------------------------------------------------------------------

export type BuildLog = {
  week: string;
  title: string;
  page: string;
  goal: string;
  tests: string;
  broke: string;
  fixed: string;
  commits: number;
};

export const BUILD_LOGS: BuildLog[] = [
  {
    week: "Week 0",
    title: "Builder infrastructure",
    page: "/",
    goal: "Next.js + Tailwind scaffold, deploy pipeline to Vercel, Supabase connection.",
    tests: "Site deployed on Vercel; Supabase connection check on the homepage.",
    broke: "Nothing recorded.",
    fixed: "—",
    commits: 3,
  },
  {
    week: "Week 1",
    title: "Generative core: order parser",
    page: "/core",
    goal: "Turn a free-text order into items, notes and a pickup time, and save it.",
    tests: "3 example orders parsed, saved and still listed after refresh (Aug 31, 2026).",
    broke: "Saving failed with a 404 on a doubled /rest/v1/rest/v1/ path: the Supabase URL env var had a /rest/v1/ suffix.",
    fixed: "Re-added the env var with the correct value and forced a fresh build (ebacdd6).",
    commits: 6,
  },
  {
    week: "Week 2",
    title: "Research + benchmarking",
    page: "/research",
    goal: "Prove the problem is real and map competitors, including anything already at IBERO.",
    tests: "Competitor filter, saved notes, first real student conversation (Sept 14, 2026).",
    broke: "A missing closing section tag broke the page; a later edit dropped part of it.",
    fixed: "Closing tag fixed (7ef9131) and the full page restored (24bc3e4).",
    commits: 8,
  },
  {
    week: "Week 3",
    title: "Product + pricing",
    page: "/pricing, /product",
    goal: "Map features to plans and simulate revenue from students and vendors.",
    tests: "Pricing logic checks; saved scenarios; second real student conversation (Sept 28, 2026).",
    broke: "Console warning \"Multiple GoTrueClient instances\" (two Supabase clients); a rejected push.",
    fixed: "Reused the one shared client (e4093d4); git fetch + git status before every push since then.",
    commits: 8,
  },
  {
    week: "Week 4",
    title: "Marketing engine",
    page: "/marketing, /",
    goal: "Brand, persona, posts, scripts, 14-day calendar, A/B tests; homepage becomes a landing page.",
    tests: "12 of 12 marketing checks, copy/export, saves persist; A/B tests with real students.",
    broke: "/pricing and /product were nearly unreadable in light mode; the parser only understands English.",
    fixed: "Theme-aware colors (bae7e2d); kept the parser English and made every demo example English.",
    commits: 6,
  },
  {
    week: "Week 5",
    title: "Guided assistant",
    page: "/chat",
    goal: "Order helper with intake, FAQ, 8 guardrails, confirm step and hand-off; English by default.",
    tests: "17 of 17 chat checks, 3 software tests, 3 external testers (Nov 6, 2026).",
    broke: "Leftover card words read as food; \"2 tacos\" read as 2:00 PM; Tester 2's one-sentence order found no items.",
    fixed: "One fix and one logic check each (1a47613, c1c1e97). Instructor: testers never asked a question, hit a guardrail or used 👍/👎.",
    commits: 6,
  },
  {
    week: "Week 6",
    title: "Integrated venture + impact",
    page: "/demo, /dashboard, /docs",
    goal: "One guided walkthrough, one dashboard of every record, agent map, impact check, V2 roadmap, 5 new testers.",
    tests: "3 software tests and the full-site regression (10/10 pages) passed on production, Nov 14, 2026; 5 of 5 external testers finished /demo on Nov 18 (4 yes, 1 maybe; 4.6/5 useful; 17 min average in line).",
    broke: "Build: an unknown place was read as part of the food. External tests (Nov 18): 0 of 5 got the question tick, because real questions the bot couldn't answer (\"Do you have the menus…?\", \"How do i order?\") didn't count; \"but with no cheese\" became a separate item; \"Can I pay with cash?\" was read as an order.",
    fixed: "Unknown places asked about (check 18). Menu and how-to-order answers added; unanswered questions now count, are saved for the builder and get an honest reply; changes like \"but with no cheese\" stay notes on the item; non-order \"Can I…?\" questions are questions (checks 20–21, demo check 3b).",
    commits: 5,
  },
];
