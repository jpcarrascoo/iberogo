// Week 2 — Research + Benchmarking data.
//
// Every entry here is a REAL product, found via web search (not invented),
// with a source link. Where a fact/stat is quoted from the source, it's kept
// close to how the source states it. This file is data + types only — no
// AI call, simulated or otherwise; the "research" this week is honest
// desk research, not a generative feature.

export type CompetitorType = "Global example" | "Mexico" | "Substitute";

export type Competitor = {
  id: string;
  name: string;
  region: string;
  type: CompetitorType;
  category: string;
  description: string;
  keyFact: string;
  source: string;
  isGlobalExample?: boolean;
};

// 8 required competitors/substitutes. The first 5 flagged isGlobalExample
// double as the "5 global examples" requirement (shown as benchmark cards);
// all 8 together are the required competitor/substitute table.
export const COMPETITORS: Competitor[] = [
  {
    id: "grubhub-campus",
    name: "Grubhub Campus Dining",
    region: "United States",
    type: "Global example",
    category: "Campus ordering app (corporate)",
    description:
      "Grubhub's dedicated campus product, built on top of Tapingo after Grubhub acquired it. Used at dozens of US universities (Notre Dame, Ohio State, KU, UND, and others) for on-campus pre-ordering and pickup.",
    keyFact: "Live at 200+ US campuses via university dining partnerships.",
    source: "https://dining.nd.edu/whats-happening/news/grubhub-new-app-for-preordering-food-on-campus/",
    isGlobalExample: true,
  },
  {
    id: "tapingo",
    name: "Tapingo",
    region: "United States",
    type: "Global example",
    category: "Campus ordering app (acquired)",
    description:
      "Founded 2012, focused exclusively on college campuses — students could pay with their meal plan. Proof that this exact problem is worth real money: Grubhub bought it in September 2018 for about $150 million, then folded it into Grubhub Campus Dining.",
    keyFact: "Acquired by Grubhub, Sept. 2018, ~$150M.",
    source: "https://en.wikipedia.org/wiki/Tapingo",
    isGlobalExample: true,
  },
  {
    id: "transact-get",
    name: "Transact Mobile Ordering (GET)",
    region: "United States",
    type: "Global example",
    category: "Campus ordering app (corporate)",
    description:
      "Mobile ordering built into university meal-plan/ID-card systems (Case Western, Adelphi, Tulsa, UCLA, and others). Ties ordering directly to the student's existing campus card balance.",
    keyFact: "Deployed via university card-services contracts, not a standalone consumer app.",
    source: "https://case.edu/dining/how-pay/transact-mobile-orderingcampus-dining-app",
    isGlobalExample: true,
  },
  {
    id: "jamezz",
    name: "Jamezz",
    region: "Europe",
    type: "Global example",
    category: "Campus ordering platform (corporate)",
    description:
      "European digital-ordering platform for campus dining — QR ordering, kiosks, and a pre-order webshop, in 25+ languages. Markets itself directly on queue-time reduction.",
    keyFact: "Claims universities using it see 40% shorter queues at peak lunch hours.",
    source: "https://jamezz.com/industries/universities",
    isGlobalExample: true,
  },
  {
    id: "hkust",
    name: "HKUST Online Food Ordering",
    region: "Hong Kong",
    type: "Global example",
    category: "Campus ordering system (university-run)",
    description:
      "Hong Kong University of Science and Technology's own online ordering system for campus restaurants — order ahead from web or app, skip the line at pickup.",
    keyFact: "Run directly by the university's Campus Services Office, not a third-party vendor.",
    source: "https://cso.hkust.edu.hk/Welcome%20to%20Campus%20%E2%80%93%20Skip%20the%20Line%20with%20Online%20Food%20Ordering!",
    isGlobalExample: true,
  },
  {
    id: "coco",
    name: "Coco",
    region: "Mexico",
    type: "Mexico",
    category: "Campus ordering platform (startup)",
    description:
      "Mexican pre-order platform for school and university cafeterias — works with a campus's existing point-of-sale, no new hardware required. Reports 1,000,000+ lines avoided and 50,000+ users. IMPORTANT: its published client list includes Universidad Iberoamericana — the closest real-world precedent to IBEROGO, potentially already live at an IBERO campus.",
    keyFact: "Client list includes Universidad Iberoamericana, Universidad Anáhuac, UPAEP.",
    source: "https://cocoapp.mx/",
  },
  {
    id: "infood",
    name: "Infood",
    region: "Mexico (CDMX)",
    type: "Mexico",
    category: "Campus ordering app (student project)",
    description:
      "Built by six Tecnológico de Monterrey Mexico City students, presented at the Emprendeweb entrepreneurship showcase (2020). Same core loop as /core: pick a restaurant, choose a meal, pay, schedule pickup, get notified when ready.",
    keyFact: "Built to fix a measured average wait of 5 minutes 54 seconds before ordering ahead.",
    source: "https://conecta.tec.mx/es/noticias/ciudad-de-mexico/emprendedores/una-app-que-evitara-las-filas-y-la-espera-por-tu-comida-en",
  },
  {
    id: "jitpickup",
    name: "Jit Pickup",
    region: "Mexico",
    type: "Mexico",
    category: "Campus ordering app (startup)",
    description:
      "Connects students, faculty, and staff to on-campus restaurants — browse, pay, schedule pickup, real-time prep tracking. Free for end users; monetizes through participating restaurants.",
    keyFact: "Markets itself as \"the quickest and most practical way to order food within your university.\"",
    source: "https://www.jitpickup.com/",
  },
  {
    id: "drizline",
    name: "Drizline",
    region: "Mexico",
    type: "Mexico",
    category: "Cafeteria management platform (broader than ordering)",
    description:
      "Cafeteria operations platform, not just an ordering app — mobile ordering plus digital wallets, biometric/QR/RFID access, kitchen integration, and inventory tracking. A heavier, more institutional sell than IBEROGO's scope.",
    keyFact: "Sells consulting, staff training, and equipment alongside the software.",
    source: "https://universidades.drizline.com/",
  },
  {
    id: "status-quo",
    name: "Arrive early / skip a class",
    region: "IBERO (current default)",
    type: "Substitute",
    category: "Behavioral substitute (no app)",
    description:
      "The actual substitute IBEROGO competes with today: students budget extra time before their break, or skip part of a class, to beat the line. Free, requires no adoption — and exactly the cost in time and attention IBEROGO exists to remove.",
    keyFact: "Zero-cost, zero-adoption-risk substitute — the real baseline any new tool has to beat.",
    source: "",
  },
];

export const GLOBAL_EXAMPLES = COMPETITORS.filter((c) => c.isGlobalExample);

export type Risk = {
  id: string;
  name: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  note: string;
};

// Risk map — plotted Likelihood x Impact. Ordered roughly worst-first.
export const RISKS: Risk[] = [
  {
    id: "existing-competitor",
    name: "A real competitor may already serve an IBERO campus",
    likelihood: "High",
    impact: "High",
    note:
      "Coco's public client list names Universidad Iberoamericana directly. This needs to be checked for fact with a real person (see Human Validation below), not assumed away.",
  },
  {
    id: "restaurant-adoption",
    name: "Restaurants won't hand over real menu/price data without proof of demand",
    likelihood: "Medium",
    impact: "High",
    note: "Matches the menu-upload conversation from Week 1 — this is a real, not hypothetical, blocker.",
  },
  {
    id: "habit-change",
    name: "Students don't change their habit from walking up to the counter",
    likelihood: "Medium",
    impact: "Medium",
    note: "The behavioral substitute (arrive early) is free and requires zero learning — the bar to beat it is real.",
  },
  {
    id: "stale-menus",
    name: "Menu data goes stale without a restaurant actively maintaining it",
    likelihood: "High",
    impact: "Medium",
    note: "No restaurant-side dashboard exists yet — out of scope this semester, tracked as a scope cut.",
  },
  {
    id: "payments",
    name: "Real payment processing adds compliance/PCI overhead",
    likelihood: "Low",
    impact: "Medium",
    note: "Out of scope this semester — no real payments are processed by IBEROGO yet.",
  },
];
