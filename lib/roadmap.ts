// Week 6 — Version 2 roadmap.
//
// Every item says WHY it's on the list and where that evidence came from.
// Order = priority. Re-ranked by hand after the 5 external /demo tests.

export type RoadmapSize = "S" | "M" | "L";

export type RoadmapItem = {
  id: string;
  title: string;
  why: string;
  source: string; // where the evidence comes from
  size: RoadmapSize;
};

export const ROADMAP_V2: RoadmapItem[] = [
  {
    id: "vendor-pilot",
    title: "Pilot with one real campus vendor",
    why: "Nothing reaches a kitchen today. A real pilot is the only way to learn if vendors will prepare pickup orders on time.",
    source: "Week 2 research (Coco already works with cafeterias) · Week 3 vendor segment",
    size: "L",
  },
  {
    id: "menus",
    title: "Real vendor names and menus",
    why: "The parser can't catch a misspelled dish or a dish that doesn't exist, because there is no menu yet.",
    source: "Week 1 known limitation · FAQ \"What's on the menu?\"",
    size: "M",
  },
  {
    id: "spanish",
    title: "Spanish order parsing",
    why: "IBERO students write in Spanish; today \"2 tacos sin cebolla\" becomes one item with no time.",
    source: "Week 4 build finding (/core only understands English)",
    size: "M",
  },
  {
    id: "handoff-resolve",
    title: "Resolve hand-offs from the dashboard",
    why: "Flagged chats (allergies, complaints) can be read but not marked as handled, so the human-review list only grows.",
    source: "Week 5 scope cut · /dashboard Needs human review",
    size: "M",
  },
  {
    id: "accounts",
    title: "Student accounts and order history",
    why: "Reordering a usual lunch and the Campus Pass schedule both need to remember the student.",
    source: "Week 3 Campus Pass features",
    size: "L",
  },
  {
    id: "payments",
    title: "Payments, only after the vendor pilot",
    why: "Charging before a real order can be delivered would break trust; payments stay out until the pilot works.",
    source: "Week 5 guardrail G6 · Week 6 harm checklist",
    size: "L",
  },
  {
    id: "llm",
    title: "Optional AI replies behind the same guardrails",
    why: "The rule-based assistant says \"I'm not sure\" to anything outside its rules; an AI model could answer more, but only after the same 8 guardrails.",
    source: "Week 5 fallback replies",
    size: "M",
  },
  {
    id: "coco",
    title: "Clear positioning against Coco",
    why: "Coco lists Universidad Iberoamericana as a client; IBEROGO must say clearly why a student would choose it instead.",
    source: "Week 2 risk map",
    size: "S",
  },
];
