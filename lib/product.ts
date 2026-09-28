// IBEROGO — Week 3 product architecture.
// Honest status: only features that actually run on the live site are marked "Built".

export type Tier = "Básico" | "Plus" | "Campus Pass" | "Vendor";
export const TIER_COLUMNS: Tier[] = ["Básico", "Plus", "Campus Pass", "Vendor"];

export type Feature = {
  name: string;
  description: string;
  status: "Built" | "Planned";
  week: string; // week shipped, or "Roadmap"
  tiers: Tier[];
  link?: string;
};

export const FEATURES: Feature[] = [
  {
    name: "Free-text order parser",
    description: "Type an order like a text message; get items, quantities, notes and pickup time.",
    status: "Built",
    week: "Week 1",
    tiers: ["Básico", "Plus", "Campus Pass"],
    link: "/core",
  },
  {
    name: "Choose pickup point + time",
    description: "Students pick where and when to collect, instead of classroom delivery or waiting in line.",
    status: "Built",
    week: "Week 1",
    tiers: ["Básico", "Plus", "Campus Pass"],
    link: "/core",
  },
  {
    name: "Research + benchmarking dashboard",
    description: "Competitor table, Mexico localization and risk map behind the product decisions.",
    status: "Built",
    week: "Week 2",
    tiers: [],
    link: "/research",
  },
  {
    name: "Pricing simulator",
    description: "Editable revenue model across both paying segments.",
    status: "Built",
    week: "Week 3",
    tiers: [],
    link: "/pricing",
  },
  {
    name: "Priority preparation",
    description: "Subscriber orders move ahead in the kitchen queue.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Plus", "Campus Pass"],
  },
  {
    name: "Reserved peak-hour pickup slots",
    description: "Guaranteed pickup windows between classes at busy times.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Plus", "Campus Pass"],
  },
  {
    name: "Member discounts",
    description: "Small recurring discounts at partner vendors.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Plus", "Campus Pass"],
  },
  {
    name: "Schedule-based pre-orders",
    description: "Orders timed to a student's class schedule, placed before arriving on campus.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Campus Pass"],
  },
  {
    name: "Saved food preferences",
    description: "Usual orders and restrictions remembered.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Campus Pass"],
  },
  {
    name: "Vendor order dashboard",
    description: "Incoming orders with pickup times, so vendors can prep ahead.",
    status: "Planned",
    week: "Roadmap",
    tiers: ["Vendor"],
  },
];

export type Segment = {
  name: string;
  who: string;
  gets: string[];
  pays: string;
};

export const SEGMENTS: Segment[] = [
  {
    name: "IBERO students",
    who: "Students who want to order the way they text and pick up between classes.",
    gets: [
      "Free-text ordering with their own pickup point and time (free)",
      "Optional Plus or Campus Pass for priority and schedule-based ordering",
    ],
    pays: "$0, $59 or $129 MXN per month, by tier",
  },
  {
    name: "Campus restaurants and vendors",
    who: "Cafeterias and food vendors on or near campus that fill IBEROGO orders.",
    gets: [
      "Orders arrive structured, with a known pickup time",
      "Fewer walk-up peaks; a planned order dashboard",
    ],
    pays: "5% commission per order, nothing up front",
  },
];
