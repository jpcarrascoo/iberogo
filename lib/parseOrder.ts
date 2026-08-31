// Week 1 — Generative Core Agent: Order Parser
//
// This is a SIMULATED core: a hand-written, rule-based text parser, not a
// call to an external AI API. That's intentional — this week's constraints
// are "free tools only" and "no paid APIs required," and the course rule is
// that simulated AI output must be labeled clearly. See the "Simulated
// core" label wherever this function's output is rendered.
//
// It turns a free-text order like:
//   "2 tacos, no onions, and a coke from Cafeteria Central, pickup around 1pm"
// into structured data: items (with quantity + notes), an optional
// restaurant guess, a pickup time guess, and any leftover instructions.

export type ParsedItem = {
  name: string;
  quantity: number;
  notes: string | null;
};

export type ParsedOrder = {
  restaurant: string | null;
  items: ParsedItem[];
  pickupTimeRaw: string | null;
  pickupTimeIso: string | null;
  specialInstructions: string | null;
};

const RESTAURANT_RE = /\bfrom\s+([a-z0-9' ]+?)(?=,|\.|$| pickup| at | around | by )/i;

// Matches things like "at 1pm", "around 1:30", "by noon", "at 13:00",
// "pickup at 1", optionally preceded by "pickup"/"ready".
const TIME_RE =
  /\b(?:pickup|ready)?\s*(?:at|around|by)\s+(noon|midnight|\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i;

const NOTE_RE = /^(no|without|extra)\s+.+/i;

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function toTitleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function parseTimeToIso(rawMatch: string): string | null {
  const now = new Date();
  const text = rawMatch.toLowerCase().trim();

  let hour: number;
  let minute = 0;

  if (text === "noon") {
    hour = 12;
  } else if (text === "midnight") {
    hour = 0;
  } else {
    const m = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (!m) return null;
    hour = parseInt(m[1], 10);
    minute = m[2] ? parseInt(m[2], 10) : 0;
    const meridiem = m[3];
    if (meridiem === "pm" && hour < 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;
    // No am/pm given (e.g. "at 1"): this is a lunch-ordering app, so we
    // assume midday hours (1-7) mean PM. This assumption is documented in
    // /docs, not hidden.
    if (!meridiem && hour >= 1 && hour <= 7) hour += 12;
  }

  if (hour < 0 || hour > 23) return null;

  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  return d.toISOString();
}

export function parseOrderText(raw: string): ParsedOrder {
  let working = raw.trim();

  // 1. Restaurant
  let restaurant: string | null = null;
  const restMatch = working.match(RESTAURANT_RE);
  if (restMatch) {
    restaurant = toTitleCase(restMatch[1]);
    working = working.replace(restMatch[0], " ");
  }

  // 2. Pickup time
  let pickupTimeRaw: string | null = null;
  let pickupTimeIso: string | null = null;
  const timeMatch = working.match(TIME_RE);
  if (timeMatch) {
    pickupTimeRaw = timeMatch[0].trim();
    pickupTimeIso = parseTimeToIso(timeMatch[1]);
    working = working.replace(timeMatch[0], " ");
  }

  // 3. Split remaining text into item / note segments
  const segments = working
    .split(/,| and /i)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^please$/i.test(s));

  const items: ParsedItem[] = [];
  const leftover: string[] = [];

  for (const seg of segments) {
    if (NOTE_RE.test(seg)) {
      if (items.length > 0) {
        const last = items[items.length - 1];
        last.notes = last.notes ? `${last.notes}; ${seg}` : seg;
      } else {
        leftover.push(seg);
      }
      continue;
    }

    const qtyMatch = seg.match(/^(\d+)\s+(.*)/);
    const wordQtyMatch = seg.match(/^(one|two|three|four|five|six|seven|eight|nine|ten)\s+(.*)/i);
    if (qtyMatch) {
      items.push({
        quantity: parseInt(qtyMatch[1], 10),
        name: toTitleCase(qtyMatch[2].replace(/^(a|an)\s+/i, "")),
        notes: null,
      });
    } else if (wordQtyMatch) {
      items.push({
        quantity: WORD_NUMBERS[wordQtyMatch[1].toLowerCase()],
        name: toTitleCase(wordQtyMatch[2].replace(/^(a|an)\s+/i, "")),
        notes: null,
      });
    } else if (/^(a|an)\s+/i.test(seg)) {
      items.push({ quantity: 1, name: toTitleCase(seg.replace(/^(a|an)\s+/i, "")), notes: null });
    } else if (seg.split(/\s+/).length > 6) {
      // Long, sentence-like segments read as instructions, not menu items.
      leftover.push(seg);
    } else if (seg.length > 0) {
      items.push({ quantity: 1, name: toTitleCase(seg), notes: null });
    }
  }

  const specialInstructions = leftover.length ? toTitleCase(leftover.join("; ")) : null;

  return { restaurant, items, pickupTimeRaw, pickupTimeIso, specialInstructions };
}

export const EXAMPLE_ORDERS: string[] = [
  "2 tacos, no onions, and a coke, pickup around 1pm",
  "One burrito bowl from Cafeteria Central at 12:30, extra guac",
  "3 waters and a salad, ready by noon please",
];
