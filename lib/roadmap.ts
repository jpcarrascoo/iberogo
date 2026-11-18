// Week 6 — Version 2 roadmap.
//
// Every item says WHY it's on the list and where that evidence came from.
// Order = priority. Re-ranked by hand on Nov 18, 2026 after the 5 external /demo tests:
// real menus moved to #1 (Testers 1 and 2), and a new item tests whether students would
// pay at all (Tester 2), since 1 of 5 picked "None of these".

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
    id: "menus",
    title: "Real vendor names and menus",
    why: "The most asked-for thing in testing. Without a menu, students don't know what they can order, and the parser can't catch a dish that doesn't exist.",
    source: "External Tester 1 (\"the real menus\") and Tester 2 (asked \"Do you have the menus from all the restaurants?\"), Nov 18, 2026 · Week 1 known limitation",
    size: "M",
  },
  {
    id: "who-pays",
    title: "Test who pays: students, vendors, or both",
    why: "Skipping the line alone may not be worth paying for. Test a free-for-students version where vendors pay per order before pushing Plus.",
    source: "External Tester 2 (\"I dont think I would pay for not doing a line\"); plan choice: Plus 2, Campus Pass 2, None 1 (Nov 18, 2026) · Week 3 vendor commission = 79% of Base revenue",
    size: "S",
  },
  {
    id: "vendor-pilot",
    title: "Pilot with one real campus vendor",
    why: "Nothing reaches a kitchen today. A real pilot is the only way to learn if vendors will prepare pickup orders on time.",
    source: "Week 2 research (Coco already works with cafeterias) · Week 3 vendor segment",
    size: "L",
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
