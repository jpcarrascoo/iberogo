// Week 6 — one list of every page on the site.
//
// The navbar, the footer, the agent map and the site checks all read ROUTES,
// so a page can't exist without being reachable from the navigation.

export type RouteGroup = "Product" | "Venture" | "Build";

export type SiteRoute = {
  href: string;
  label: string;
  group: RouteGroup;
  week: string;
  description: string;
};

export const ROUTES: SiteRoute[] = [
  { href: "/", label: "Home", group: "Product", week: "Week 4", description: "Landing page: what IBEROGO is and why it exists." },
  { href: "/demo", label: "Demo", group: "Product", week: "Week 6", description: "5-minute guided walkthrough of the whole venture." },
  { href: "/core", label: "Order", group: "Product", week: "Week 1", description: "Type an order like a text; the parser structures it." },
  { href: "/chat", label: "Assistant", group: "Product", week: "Week 5", description: "Guided order helper with FAQ, guardrails and hand-off." },
  { href: "/pricing", label: "Pricing", group: "Product", week: "Week 3", description: "Plans and a revenue simulator." },
  { href: "/product", label: "Product", group: "Product", week: "Week 3", description: "Features mapped to plans and user segments." },
  { href: "/research", label: "Research", group: "Venture", week: "Week 2", description: "Competitors, Mexico localization and risk map." },
  { href: "/marketing", label: "Marketing", group: "Venture", week: "Week 4", description: "Brand, persona, posts, scripts, calendar, A/B tests." },
  { href: "/dashboard", label: "Dashboard", group: "Build", week: "Week 6", description: "Every saved record, test results and site health." },
  { href: "/docs", label: "Docs", group: "Build", week: "Week 6", description: "Prompt library, build logs and the agent map." },
];

export const ROUTE_GROUPS: RouteGroup[] = ["Product", "Venture", "Build"];

export const GITHUB_URL = "https://github.com/jpcarrascoo/iberogo";

export function routesIn(group: RouteGroup): SiteRoute[] {
  return ROUTES.filter((r) => r.group === group);
}

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// --- Agent map ------------------------------------------------------------------

export type AgentKind = "Real logic" | "Simulated / rule-based" | "AI-assisted, human-reviewed";

export type AgentNode = {
  id: string;
  name: string;
  week: string;
  kind: AgentKind;
  href: string;
  does: string;
  writesTo: string[]; // Supabase tables
};

export const AGENT_MAP: AgentNode[] = [
  {
    id: "parser",
    name: "Order parser",
    week: "Week 1",
    kind: "Simulated / rule-based",
    href: "/core",
    does: "Turns \"2 tacos, no onions, pickup at 1\" into items, notes and a pickup time.",
    writesTo: ["core_outputs"],
  },
  {
    id: "research",
    name: "Research benchmark",
    week: "Week 2",
    kind: "AI-assisted, human-reviewed",
    href: "/research",
    does: "Real competitors found with AI-assisted web search, each with a source link, checked by hand.",
    writesTo: ["research_entries"],
  },
  {
    id: "pricing",
    name: "Pricing simulator",
    week: "Week 3",
    kind: "Real logic",
    href: "/pricing",
    does: "Plain formulas: students × adoption × plan share = monthly revenue.",
    writesTo: ["pricing_scenarios"],
  },
  {
    id: "marketing",
    name: "Marketing content engine",
    week: "Week 4",
    kind: "AI-assisted, human-reviewed",
    href: "/marketing",
    does: "Posts and scripts drafted with AI from real research, reviewed before use; A/B votes from real students.",
    writesTo: ["marketing_assets", "ab_votes"],
  },
  {
    id: "assistant",
    name: "Guided assistant",
    week: "Week 5",
    kind: "Simulated / rule-based",
    href: "/chat",
    does: "Asks what, when and where, answers FAQ, applies 8 guardrails and hands risky chats to a person.",
    writesTo: ["chat_sessions"],
  },
  {
    id: "demo",
    name: "Demo + impact check",
    week: "Week 6",
    kind: "Real logic",
    href: "/demo",
    does: "Walks a tester through the product and records what they did and whether it would help them.",
    writesTo: ["demo_runs", "chat_sessions"],
  },
];

export const HUMAN_REVIEW = {
  name: "Human review (the builder)",
  href: "/dashboard",
  does: "Reads hand-offs and test results on /dashboard and decides what goes into Version 2. No agent acts on its own.",
};
