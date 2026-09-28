// IBEROGO — Week 3 pricing model.
// Pure functions only: the /pricing UI and the on-page logic checks both call these,
// so the tests exercise the same code the calculator uses.

export type PricingInputs = {
  reachableStudents: number;
  adoptionPct: number; // 0–100
  plusSharePct: number; // 0–100, share of active users on Plus
  passSharePct: number; // 0–100, share of active users on Campus Pass
  plusPrice: number; // MXN / month
  passPrice: number; // MXN / month
  ordersPerUser: number; // orders per active user per month
  avgOrderValue: number; // MXN
  commissionPct: number; // 0–100, vendor fee per order
};

export type RevenueResult = {
  activeUsers: number;
  subscriptionMonthly: number;
  vendorMonthly: number;
  monthlyTotal: number;
  annualTotal: number;
};

export type ScenarioKey = "conservative" | "base" | "optimistic";

export const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  conservative: "Conservative",
  base: "Base",
  optimistic: "Optimistic",
};

const SHARED = {
  reachableStudents: 10000,
  plusPrice: 59,
  passPrice: 129,
  avgOrderValue: 90,
  commissionPct: 5,
};

export const PRESETS: Record<ScenarioKey, PricingInputs> = {
  conservative: { ...SHARED, adoptionPct: 2, plusSharePct: 5, passSharePct: 1, ordersPerUser: 4 },
  base: { ...SHARED, adoptionPct: 5, plusSharePct: 10, passSharePct: 3, ordersPerUser: 8 },
  optimistic: { ...SHARED, adoptionPct: 10, plusSharePct: 15, passSharePct: 5, ordersPerUser: 12 },
};

export const TIERS = [
  {
    name: "Básico",
    price: 0,
    summary: "Order in plain text and choose your own pickup point and time.",
    includes: ["Free-text ordering", "Choose pickup point + time", "Standard prep queue"],
  },
  {
    name: "Plus",
    price: 59,
    summary: "Priority without paying a fee on every order.",
    includes: ["Everything in Básico", "Priority preparation", "Reserved pickup slots at peak hours", "Member discounts"],
  },
  {
    name: "Campus Pass",
    price: 129,
    summary: "Food that fits your class schedule.",
    includes: ["Everything in Plus", "Schedule-based pre-orders", "Saved food preferences"],
  },
] as const;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function validateInputs(i: PricingInputs): string[] {
  const errors: string[] = [];
  const entries = Object.entries(i) as [keyof PricingInputs, number][];
  for (const [key, value] of entries) {
    if (!Number.isFinite(value)) errors.push(`${key} must be a number.`);
    else if (value < 0) errors.push(`${key} can't be negative.`);
  }
  for (const key of ["adoptionPct", "plusSharePct", "passSharePct", "commissionPct"] as const) {
    if (i[key] > 100) errors.push(`${key} can't be more than 100%.`);
  }
  if (i.plusSharePct + i.passSharePct > 100) {
    errors.push(
      `Plus share + Campus Pass share is ${i.plusSharePct + i.passSharePct}%. Together they can't exceed 100% of active users.`
    );
  }
  return errors;
}

export function calculateRevenue(i: PricingInputs): RevenueResult {
  const activeUsers = round2(i.reachableStudents * (i.adoptionPct / 100));
  const subscriptionMonthly = round2(
    activeUsers * ((i.plusSharePct / 100) * i.plusPrice + (i.passSharePct / 100) * i.passPrice)
  );
  const vendorMonthly = round2(activeUsers * i.ordersPerUser * i.avgOrderValue * (i.commissionPct / 100));
  const monthlyTotal = round2(subscriptionMonthly + vendorMonthly);
  const annualTotal = round2(monthlyTotal * 12);
  return { activeUsers, subscriptionMonthly, vendorMonthly, monthlyTotal, annualTotal };
}

export type LogicTest = { name: string; expected: string; actual: string; pass: boolean };

export function runLogicTests(): LogicTest[] {
  const base = calculateRevenue(PRESETS.base);
  const expected = { activeUsers: 500, subscriptionMonthly: 4885, vendorMonthly: 18000, monthlyTotal: 22885, annualTotal: 274620 };
  const test1Pass = (Object.keys(expected) as (keyof RevenueResult)[]).every((k) => base[k] === expected[k]);

  const invalid = validateInputs({ ...PRESETS.base, plusSharePct: 60, passSharePct: 50 });
  const test2Pass = invalid.length > 0;

  return [
    {
      name: "Test 1: Base scenario math",
      expected: "500 users · $4,885 subs · $18,000 vendor · $22,885/mo · $274,620/yr",
      actual: `${base.activeUsers} users · ${formatMXN(base.subscriptionMonthly)} subs · ${formatMXN(base.vendorMonthly)} vendor · ${formatMXN(base.monthlyTotal)}/mo · ${formatMXN(base.annualTotal)}/yr`,
      pass: test1Pass,
    },
    {
      name: "Test 2: Invalid tier mix is blocked (60% + 50%)",
      expected: "At least one validation error",
      actual: invalid.length ? `${invalid.length} error(s): ${invalid[0]}` : "No errors (should have blocked)",
      pass: test2Pass,
    },
  ];
}

export function formatMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(n);
}
