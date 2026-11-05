// Week 5 — Public Chatbot / Guided Assistant
//
// This is a SIMULATED assistant: a hand-written, rule-based state machine,
// not a call to an AI/LLM API (course rule: free tools only, and simulated
// AI output must be labeled clearly — /chat says so at the top).
//
// Every student message goes through the same order of checks:
//   1. guardrails (length, payment data, personal data, allergy, abuse,
//      over-claims, "talk to a human", off-topic)
//   2. the current intake step (what → when → where → confirm)
//   3. FAQ intents
//   4. fallback (two unknowns in a row → hand-off to a person)
//
// Everything here is pure (no React, no network) so the "Chat logic checks"
// panel on /chat can run the exact same functions the UI uses.

import { parseOrderText, type ParsedItem } from "./parseOrder";
import { DEMO_EXAMPLE, LANDING } from "./marketing";
import { TIERS } from "./pricing";

// --- Types --------------------------------------------------------------------

export type Step = "q1_order" | "q2_time" | "q2_confirm_time" | "q3_point" | "summary" | "done";

export type GuardrailId =
  | "G1_allergy"
  | "G2_payment"
  | "G3_personal_data"
  | "G4_off_topic"
  | "G5_abuse"
  | "G6_over_claim"
  | "G7_human"
  | "G8_too_long";

export const GUARDRAIL_LABELS: Record<GuardrailId, string> = {
  G1_allergy: "Allergy / dietary safety",
  G2_payment: "Payment data",
  G3_personal_data: "Personal data",
  G4_off_topic: "Off-topic",
  G5_abuse: "Abusive language",
  G6_over_claim: "Is my order real?",
  G7_human: "Asked for a human",
  G8_too_long: "Message too long",
};

export type OrderSummary = {
  items: ParsedItem[];
  pickupTime: string; // display label, e.g. "1:00 PM"
  pickupPoint: string;
  allergyNote: string | null;
};

export type ChatState = {
  step: Step;
  orderText: string | null;
  items: ParsedItem[];
  pickupTime: string | null;
  pickupPoint: string | null;
  allergyNote: string | null;
  orderRetries: number;
  unknownStreak: number;
  confirmed: boolean;
  handoffReason: string | null;
  guardrails: GuardrailId[]; // every guardrail triggered this session (unique)
};

export type Reply = {
  text: string;
  chips?: string[];
  summary?: OrderSummary;
  guardrail?: GuardrailId;
};

export type RespondResult = {
  replies: Reply[];
  next: ChatState;
  flags: GuardrailId[]; // guardrails triggered by THIS message
  shownText: string; // the student's message as stored/displayed (redacted)
};

// --- Fixed data ------------------------------------------------------------------

// Example pickup points until real ones are agreed with campus vendors.
// The UI labels these "Example pickup points (not final)".
export const PICKUP_POINTS_ARE_EXAMPLES = true;
export const PICKUP_POINTS = ["Main cafeteria", "Library entrance", "Main gate"];

export const TIME_CHIPS = ["12:00 PM", "1:00 PM", "2:00 PM"];

export const MAX_MESSAGE_LENGTH = 500;

const basic = TIERS[0];
const plus = TIERS[1];
const pass = TIERS[2];

// Every fixed sentence the assistant can say lives here, so the banned-phrase
// check can scan all of them.
export const R = {
  greeting:
    "Hi! I'm the IBEROGO order helper: a rule-based demo, not an AI and not a person. I'll ask you 3 quick questions to set up a pickup order. Nothing is sent to a kitchen and nothing is charged.",
  q1: `1/3 · What would you like to order? Type it like a text, e.g. "${DEMO_EXAMPLE}".`,
  q1Retry: `I couldn't find any items in that. Try something like "2 tacos and a coke" (I understand English orders).`,
  q1GiveUp:
    "I still couldn't read an order there, so I've flagged this chat for a person on the IBEROGO team to look at. You can keep asking me questions, or press Start over.",
  q2: "2/3 · When do you want to pick it up? (e.g. 1:00 PM)",
  q2Retry: "I didn't catch a time. Try something like 12:30 or 1 PM.",
  q2LooksLikeFood: (order: string) =>
    `That looks like food, not a time. Your order so far is ${order || "empty"}; press Start over if you want to change it. When do you want to pick it up? (e.g. 1:00 PM)`,
  q2ConfirmPrompt: "Please answer Yes, or type a different time.",
  q3: "3/3 · Where do you want to pick it up? Choose a point or type one.",
  q3Retry: "Please choose a pickup point, or type a short place name.",
  summaryIntro: "Here's your order. Please check it: nothing counts until you press Confirm.",
  summaryPrompt: "Please press Confirm if the order is right, or Edit to start it again.",
  confirmed:
    "Confirmed as a test order request. Reminder: this is a prototype, so no kitchen receives it and nothing is charged. You can ask me anything about IBEROGO, or rate this chat below.",
  confirmedHandoff:
    "Because of the allergy note, a person on the IBEROGO team will review this request. I can't confirm allergen safety myself.",
  edit: "No problem, let's start the order again.",
  doneHint: "Anything else? Ask me about plans, how IBEROGO works, or say \"new order\".",
  greetingReply: "Hi! 👋",
  // Guardrails
  g1:
    "Thanks for telling me. I can't guarantee that any food is free of allergens, and I won't guess. I've added your note to the order and flagged it so a person checks with the vendor first. If it's a severe allergy, please confirm directly with the cafeteria staff before eating.",
  g2:
    "Please don't share card details here. IBEROGO doesn't take payments yet, and I've removed that number from this chat.",
  g3: "Heads up: I've removed that personal info. There's no need to share emails or phone numbers here.",
  g4: "I can only help with IBEROGO: setting up a pickup order and questions about how it works, plans and prices.",
  g5: "I'm here to help, but let's keep it respectful. We can keep going whenever you're ready.",
  g6:
    "To be clear: IBEROGO is a prototype. Nothing has been sent to a kitchen, there's no real order to track, and nothing was charged.",
  g7:
    "Got it. I've flagged this chat so a person on the IBEROGO team can review it. There's no live chat yet, so it won't be instant.",
  g8: `That message is a bit long for me (over ${MAX_MESSAGE_LENGTH} characters). Could you send a shorter version?`,
  // Fallback
  unknown:
    "I'm not sure about that one. I can help with setting up a pickup order, plans and prices, how IBEROGO works, and whether it's official.",
  unknownHandoff:
    "I couldn't answer two messages in a row, so I've flagged this chat for a person on the IBEROGO team to review.",
};

export type FaqIntent = { id: string; label: string; pattern: RegExp; answer: string };

export const FAQ: FaqIntent[] = [
  {
    id: "menu",
    label: "What's on the menu?",
    pattern: /\b(menu|what (food|can i (order|eat|get))|what do you (have|sell)|which (vendors|restaurants|cafeterias))\b/i,
    answer:
      "There's no real menu yet, because cafeterias haven't joined IBEROGO. For this demo you can type any food, like you'd text a friend.",
  },
  {
    id: "official",
    label: "Is this official IBERO?",
    pattern: /\b(official|affiliat\w*|run by (the )?ibero|is (this|it|iberogo) (from|by|part of) (the )?ibero)\b/i,
    answer: LANDING.faq[0].a.en,
  },
  {
    id: "order_pay",
    label: "Can I order and pay yet?",
    pattern: /\bcan i (really |actually )?(order|pay|buy)( (yet|now|already|here|with (this|iberogo)))?\s*\??\s*$|\b(how (do i|to|can i) pay|(take|accept)s? (payments?|cards?|cash)|payment methods?)\b/i,
    answer: LANDING.faq[1].a.en,
  },
  {
    id: "pricing",
    label: "How much does it cost?",
    pattern: /\b(price|prices|pricing|cost|costs|how much|plans?|plus|campus pass|subscription|subscribe|is it free)\b/i,
    answer: `${basic.name} is free ($${basic.price}): ${basic.summary.toLowerCase()} ${plus.name} would be $${plus.price}/month (${plus.summary.toLowerCase()}) and ${pass.name} $${pass.price}/month (${pass.summary.toLowerCase()}). ${plus.name} and ${pass.name} are proposals we're still validating with students.`,
  },
  {
    id: "how_it_works",
    label: "How does it work?",
    pattern: /\b(how (does|do) (it|this|iberogo) work|what (is|does) (iberogo|this app|this)( do)?|how it works)\b/i,
    answer:
      "You type your order like a text, choose when and where to pick it up, and walk straight to your food instead of queuing. Today it's a prototype: the order isn't sent to a cafeteria yet.",
  },
  {
    id: "pickup",
    label: "Where and when can I pick up?",
    pattern: /\b(pick ?up (points?|places?|locations?|spots?|times?)|where can i (pick|get|collect)|what times?|which times?|when can i (pick|get|collect))\b/i,
    answer: `You choose the time and the point yourself. For this demo the example points are: ${PICKUP_POINTS.join(", ")} (not final; real points come once cafeterias join).`,
  },
  {
    id: "who",
    label: "Who built this?",
    pattern: /\b(who (made|built|created|runs|is behind) (this|it|iberogo)|who are you|student project)\b/i,
    answer:
      "IBEROGO is a student project built by an IBERO student for a course. It isn't affiliated with Universidad Iberoamericana.",
  },
  {
    id: "different",
    label: "How is it different from other apps?",
    pattern: /\b(different|difference|coco|rappi|uber ?eats|didi|competitors?|why not just|better than)\b/i,
    answer:
      "Instead of classroom delivery or paying a priority fee on every order, you pick your own pickup point and time between classes. You order the way you'd text a friend, with no long forms. The basic plan is free.",
  },
  {
    id: "bot",
    label: "Are you a real person / an AI?",
    pattern: /\b(are you (a |an )?(bot|robot|ai|human|person|real|chatgpt)|is this (a )?(bot|ai))\b/i,
    answer:
      "I'm a rule-based demo assistant: no AI model and no person behind me. I follow fixed rules, which is why I sometimes say I don't know.",
  },
  {
    id: "language",
    label: "Do you speak Spanish?",
    pattern: /\b(spanish|español|espanol|hablas)\b/i,
    answer: "For now I only understand English, and so does the order demo.",
  },
];

// --- Guardrail detection -------------------------------------------------------------

const ALLERGY_RE =
  /\b(allerg\w*|celiac|coeliac|gluten|peanuts?|tree nuts?|nuts|lactose|dairy[- ]free|shellfish|anaphyla\w*|epipen|intoleran\w*)\b/i;
const ABUSE_RE = /\b(stupid|idiot|dumb|shut up|f+u+c+k\w*|shit\w*|bitch\w*|asshole|moron|pendej\w*|chinga\w*|puto|puta)\b/i;
const OVER_CLAIM_RE =
  /\b((is|was|has) my (order|food) (been )?(confirmed|placed|ready|sent|on (its|the) way|coming)|when (will|does) (it|my order|my food) (arrive|come|be ready)|did (you|it) charge|charged me|track (my )?order|order status|where is my (order|food))\b/i;
const HUMAN_RE =
  /\b(talk|speak|chat) (to|with) (a |an |someone|somebody|real )?(human|person|someone|somebody|agent|staff|real person)|\b(complain\w*|refund|wrong order|terrible service|real person)\b/i;
const OFF_TOPIC_RE =
  /\b(homework|essay|assignment|thesis|write (me )?(a |an )?(poem|essay|story|code|program)|python|javascript|solve (this|my)|math problem|translate|weather|politic\w*|election|exam answers?)\b/i;
const PAYMENT_WORD_RE = /\b(cvv|cvc|card number|credit card|debit card|my card is|expiry date|expiration date)\b/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const CVV_RE = /\b(cvv|cvc)\s*(is|:)?\s*\d{3,4}\b/gi;
// Runs of 10+ digits, allowing spaces/dashes between them (cards, phones).
const DIGIT_RUN_RE = /\+?\d(?:[\s-]?\d){9,}/g;

export function luhnValid(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

/** Removes card numbers, emails and phone numbers. Used on everything shown or saved. */
export function redact(text: string): string {
  return text
    .replace(CVV_RE, "$1 [removed]")
    .replace(EMAIL_RE, "[email removed]")
    .replace(DIGIT_RUN_RE, (run) => {
      const digits = run.replace(/\D/g, "");
      if (digits.length >= 13 && digits.length <= 19) return "[card number removed]";
      if (digits.length >= 10 && digits.length <= 12) return "[phone removed]";
      return run;
    });
}

export function detectGuardrails(message: string): GuardrailId[] {
  const found: GuardrailId[] = [];
  if (message.length > MAX_MESSAGE_LENGTH) return ["G8_too_long"];
  const runs = message.match(DIGIT_RUN_RE) ?? [];
  const runDigits = runs.map((r) => r.replace(/\D/g, ""));
  if (PAYMENT_WORD_RE.test(message) || runDigits.some((d) => d.length >= 13 && d.length <= 19 && (luhnValid(d) || d.length === 16)))
    found.push("G2_payment");
  if (new RegExp(EMAIL_RE.source, "i").test(message) || runDigits.some((d) => d.length >= 10 && d.length <= 12))
    found.push("G3_personal_data");
  if (ALLERGY_RE.test(message)) found.push("G1_allergy");
  if (ABUSE_RE.test(message)) found.push("G5_abuse");
  if (OVER_CLAIM_RE.test(message)) found.push("G6_over_claim");
  if (HUMAN_RE.test(message)) found.push("G7_human");
  if (OFF_TOPIC_RE.test(message)) found.push("G4_off_topic");
  return found;
}

// Guardrails that end processing of the message (no intake/FAQ after them).
const STOPPING: GuardrailId[] = ["G4_off_topic", "G5_abuse", "G6_over_claim", "G7_human", "G8_too_long"];

const GUARDRAIL_REPLY: Record<GuardrailId, string> = {
  G1_allergy: R.g1,
  G2_payment: R.g2,
  G3_personal_data: R.g3,
  G4_off_topic: R.g4,
  G5_abuse: R.g5,
  G6_over_claim: R.g6,
  G7_human: R.g7,
  G8_too_long: R.g8,
};

// --- Helpers ----------------------------------------------------------------------------

export function initialState(): ChatState {
  return {
    step: "q1_order",
    orderText: null,
    items: [],
    pickupTime: null,
    pickupPoint: null,
    allergyNote: null,
    orderRetries: 0,
    unknownStreak: 0,
    confirmed: false,
    handoffReason: null,
    guardrails: [],
  };
}

export function openingReplies(): Reply[] {
  return [{ text: R.greeting }, { text: R.q1 }];
}

function formatTime(hour24: number, minute: number): string {
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

/** Same assumptions as the Week 1 parser: "at 1" with no am/pm means 1 PM (lunch app). */
export function parseTimeAnswer(text: string): string | null {
  // Week 5 fix (found in Software Test 3): "2 tacos" at the time question used to be read
  // as 2:00 PM. Now the answer must be ONLY a time, after removing filler words.
  const t = text
    .toLowerCase()
    .replace(/[?!.,]+/g, " ")
    .replace(/\b(pick ?up|at|around|about|by|maybe|like|please|ish|o'?clock|today)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!/^(noon|\d{1,2}(:\d{2})?\s*(am|pm|a\.m|p\.m)?)$/.test(t)) return null;
  if (/\bnoon\b/.test(t)) return formatTime(12, 0);
  const m = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\b/);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2] ? parseInt(m[2], 10) : 0;
  const mer = m[3]?.replace(/\./g, "");
  if (minute > 59) return null;
  if (mer) {
    if (hour < 1 || hour > 12) return null;
    if (mer === "pm" && hour < 12) hour += 12;
    if (mer === "am" && hour === 12) hour = 0;
  } else {
    if (hour > 23) return null;
    if (hour >= 1 && hour <= 7) hour += 12;
  }
  return formatTime(hour, minute);
}

function timeFromIso(iso: string): string {
  const d = new Date(iso);
  return formatTime(d.getHours(), d.getMinutes());
}

function describeItems(items: ParsedItem[]): string {
  return items.map((i) => `${i.quantity}× ${i.name}${i.notes ? ` (${i.notes})` : ""}`).join(", ");
}

function matchFaq(message: string): FaqIntent | null {
  return FAQ.find((f) => f.pattern.test(message)) ?? null;
}

function looksLikeQuestion(message: string): boolean {
  return /\?/.test(message) || /^(how|what|who|is|are|can|could|do|does|why|where|when|which|will)\b/i.test(message.trim());
}

const YES_RE = /^(y|yes|yeah|yep|yup|sure|correct|right|ok|okay|confirm|confirmed|that'?s right|looks good|perfect)\b/i;
const NO_RE = /^(n|no|nope|edit|change|wrong|not right|start again|redo)\b/i;
const GREETING_RE = /^(hi|hello|hey|hola|good (morning|afternoon|evening)|yo)\b[!. ]*$/i;
const NEW_ORDER_RE = /\b(new order|another order|order again|start over|start again)\b/i;

function reprompt(state: ChatState): Reply | null {
  switch (state.step) {
    case "q1_order":
      return { text: R.q1 };
    case "q2_time":
      return { text: R.q2, chips: TIME_CHIPS };
    case "q2_confirm_time":
      return { text: `Pickup at ${state.pickupTime}, right?`, chips: ["Yes", "Change time"] };
    case "q3_point":
      return { text: R.q3, chips: PICKUP_POINTS };
    case "summary":
      return { text: R.summaryPrompt, chips: ["Confirm", "Edit"] };
    case "done":
      return null;
  }
}

export function currentSummary(state: ChatState): OrderSummary {
  return {
    items: state.items,
    pickupTime: state.pickupTime ?? "—",
    pickupPoint: state.pickupPoint ?? "—",
    allergyNote: state.allergyNote,
  };
}

function resetOrder(state: ChatState): ChatState {
  return {
    ...state,
    step: "q1_order",
    orderText: null,
    items: [],
    pickupTime: null,
    pickupPoint: null,
    allergyNote: null,
    orderRetries: 0,
    confirmed: false,
  };
}

/** Drops polite wrappers ("can I get…", "I'd like…", "please", "?") before the Week 1 parser sees the order. */
export function cleanOrderText(text: string): string {
  return text
    .replace(/^(hi|hello|hey)[,!. ]+/i, "")
    .replace(/^(can|could|may) i (please )?(get|have|order)\s+/i, "")
    .replace(/^(i'?d like|i would like|i want|i'?ll have|i'?ll take|give me|let me get|i need)( to order)?\s+/i, "")
    .replace(/[?!]+\s*$/, "")
    .replace(/,?\s*please\.?\s*$/i, "")
    .trim();
}

const SENSITIVE_CLAUSE_RE =
  /\b(card|credit|debit|cvv|cvc|expiry|expiration|phone|number|cell|whatsapp|email|e-mail|mail me|text me|call me)\b/i;

/** Removes the clauses that were about card numbers, phones or emails (their data is already redacted). */
export function dropSensitiveClauses(text: string): string {
  return text
    .split(/[,.;!]| and | but /i)
    .map((s) => s.trim())
    .filter((s) => s && !SENSITIVE_CLAUSE_RE.test(s))
    .join(", ");
}

/** Removes the clauses that mention an allergy so the parser doesn't read them as menu items. */
function splitAllergy(text: string): { rest: string; note: string | null } {
  const parts = text.split(/[,.;!]| and | but /i).map((s) => s.trim()).filter(Boolean);
  const allergy = parts.filter((p) => ALLERGY_RE.test(p));
  const rest = parts.filter((p) => !ALLERGY_RE.test(p));
  return { rest: rest.join(", "), note: allergy.length ? allergy.join("; ") : null };
}

function unknownReply(next: ChatState, replies: Reply[], flags: GuardrailId[], shownText: string, again: string | null): RespondResult {
  next.unknownStreak += 1;
  if (next.unknownStreak >= 2) {
    if (!next.handoffReason) next.handoffReason = "Assistant couldn't answer 2 messages in a row";
    replies.push({ text: R.unknownHandoff });
    next.unknownStreak = 0;
  } else {
    replies.push({ text: R.unknown });
  }
  if (again) replies.push({ text: again });
  return { replies, next, flags, shownText };
}

// --- The response function --------------------------------------------------------------

export function respond(state: ChatState, rawMessage: string): RespondResult {
  const shownText = redact(rawMessage.trim());
  const flags = detectGuardrails(rawMessage.trim());
  const replies: Reply[] = [];
  let next: ChatState = { ...state, guardrails: [...new Set([...state.guardrails, ...flags])] };

  // 1. Guardrails
  for (const g of flags) replies.push({ text: GUARDRAIL_REPLY[g], guardrail: g });
  if (flags.includes("G7_human") && !next.handoffReason) next.handoffReason = "Student asked for a human / complaint";

  if (flags.some((g) => STOPPING.includes(g))) {
    const rp = reprompt(next);
    if (rp) replies.push(rp);
    return { replies, next: { ...next, unknownStreak: 0 }, flags, shownText };
  }

  // The rest of the flow only ever sees the redacted text.
  let text = shownText.replace(/\[(card number|email|phone) removed\]|\b(cvv|cvc) \[removed\]/gi, "").trim();

  // Week 5 fix (found in Software Test 3): after a card number is removed, the leftover
  // words ("my card is") used to be read as a menu item. Drop those clauses.
  if (flags.includes("G2_payment") || flags.includes("G3_personal_data")) {
    text = dropSensitiveClauses(text);
  }

  if (flags.includes("G1_allergy")) {
    const { rest, note } = splitAllergy(text);
    if (note) next.allergyNote = next.allergyNote ? `${next.allergyNote}; ${note}` : note;
    if (!next.handoffReason) next.handoffReason = `Allergy note: ${note ?? "mentioned"}`;
    text = rest;
  }

  if (!text.replace(/[^a-z0-9]/gi, "")) {
    // Nothing left to process (e.g. the message was only a card number or an allergy note).
    const rp = reprompt(next);
    if (rp) replies.push(rp);
    return { replies, next, flags, shownText };
  }

  // 2. Questions are answered at any step, then the current question is asked again.
  const faq = looksLikeQuestion(text) ? matchFaq(text) : null;
  if (faq) {
    replies.push({ text: faq.answer });
    next.unknownStreak = 0;
    const rp = reprompt(next);
    replies.push(rp ?? { text: R.doneHint });
    return { replies, next, flags, shownText };
  }

  if (GREETING_RE.test(text)) {
    replies.push({ text: R.greetingReply });
    const rp = reprompt(next);
    replies.push(rp ?? { text: R.doneHint });
    return { replies, next: { ...next, unknownStreak: 0 }, flags, shownText };
  }

  // 3. Intake steps
  switch (next.step) {
    case "q1_order": {
      if (looksLikeQuestion(text) && !/^(can|could|may) i\b/i.test(text)) {
        return unknownReply(next, replies, flags, shownText, R.q1);
      }
      if (YES_RE.test(text) || NO_RE.test(text)) {
        replies.push({ text: R.q1 });
        break;
      }
      const parsed = parseOrderText(cleanOrderText(text));
      if (parsed.items.length === 0) {
        next.orderRetries += 1;
        if (next.orderRetries >= 2) {
          if (!next.handoffReason) next.handoffReason = "Assistant couldn't read the order twice";
          replies.push({ text: R.q1GiveUp });
        } else {
          replies.push({ text: R.q1Retry });
        }
        break;
      }
      next.orderText = text;
      next.items = parsed.items;
      next.orderRetries = 0;
      if (parsed.pickupTimeIso) {
        next.pickupTime = timeFromIso(parsed.pickupTimeIso);
        next.step = "q2_confirm_time";
        replies.push({ text: `Got it: ${describeItems(parsed.items)}.` });
        replies.push({ text: `Pickup at ${next.pickupTime}, right?`, chips: ["Yes", "Change time"] });
      } else {
        next.step = "q2_time";
        replies.push({ text: `Got it: ${describeItems(parsed.items)}.` });
        replies.push({ text: R.q2, chips: TIME_CHIPS });
      }
      break;
    }
    case "q2_confirm_time": {
      if (YES_RE.test(text)) {
        next.step = "q3_point";
        replies.push({ text: R.q3, chips: PICKUP_POINTS });
      } else {
        const t = parseTimeAnswer(text);
        if (t) {
          next.pickupTime = t;
          next.step = "q3_point";
          replies.push({ text: `Pickup at ${t}.` }, { text: R.q3, chips: PICKUP_POINTS });
        } else if (NO_RE.test(text)) {
          next.step = "q2_time";
          replies.push({ text: R.q2, chips: TIME_CHIPS });
        } else {
          replies.push({ text: R.q2ConfirmPrompt, chips: ["Yes", "Change time"] });
        }
      }
      break;
    }
    case "q2_time": {
      const t = parseTimeAnswer(text);
      if (!t) {
        replies.push({ text: parseOrderText(cleanOrderText(text)).items.length && /[a-z]{3,}/i.test(text) ? R.q2LooksLikeFood(describeItems(next.items)) : R.q2Retry, chips: TIME_CHIPS });
        break;
      }
      next.pickupTime = t;
      next.step = "q3_point";
      replies.push({ text: `Pickup at ${t}.` }, { text: R.q3, chips: PICKUP_POINTS });
      break;
    }
    case "q3_point": {
      const known = PICKUP_POINTS.find((p) => p.toLowerCase() === text.toLowerCase());
      const ok = known ?? (text.length >= 2 && text.length <= 60 && !YES_RE.test(text) && !NO_RE.test(text) ? text : null);
      if (!ok) {
        replies.push({ text: R.q3Retry, chips: PICKUP_POINTS });
        break;
      }
      next.pickupPoint = known ?? `${ok} (typed by student)`;
      next.step = "summary";
      replies.push({ text: R.summaryIntro, summary: currentSummary(next), chips: ["Confirm", "Edit"] });
      break;
    }
    case "summary": {
      if (/^(confirm|confirmed|yes|y|yeah|yep|correct|looks good)\b/i.test(text)) {
        next.confirmed = true;
        next.step = "done";
        replies.push({ text: R.confirmed });
        if (next.allergyNote) replies.push({ text: R.confirmedHandoff });
      } else if (NO_RE.test(text)) {
        next = resetOrder(next);
        replies.push({ text: R.edit }, { text: R.q1 });
      } else {
        replies.push({ text: R.summaryPrompt, chips: ["Confirm", "Edit"] });
      }
      break;
    }
    case "done": {
      if (NEW_ORDER_RE.test(text)) {
        next = resetOrder(next);
        replies.push({ text: R.q1 });
        break;
      }
      return unknownReply(next, replies, flags, shownText, null);
    }
  }

  next.unknownStreak = 0;
  return { replies, next, flags, shownText };
}

// --- Session summary for storage ------------------------------------------------------

export type ChatMessage = {
  id: number;
  role: "bot" | "student";
  text: string;
  chips?: string[];
  summary?: OrderSummary;
  guardrail?: GuardrailId;
  thumb?: "up" | "down" | null;
};

export type Outcome = "confirmed" | "handoff" | "incomplete";

export type SessionRow = {
  tester_label: string | null;
  outcome: Outcome;
  handoff_reason: string | null;
  intake: { order_text: string | null; pickup_time: string | null; pickup_point: string | null; allergy_note: string | null } | null;
  parsed_order: ParsedItem[] | null;
  transcript: { role: "bot" | "student"; text: string; thumb: "up" | "down" | null }[];
  guardrails: GuardrailId[];
  thumbs_up: number;
  thumbs_down: number;
  rating: number | null;
  comment: string | null;
};

export function outcomeOf(state: ChatState): Outcome {
  if (state.handoffReason) return "handoff";
  if (state.confirmed) return "confirmed";
  return "incomplete";
}

export function thumbTally(messages: ChatMessage[]): { up: number; down: number } {
  const bot = messages.filter((m) => m.role === "bot");
  return { up: bot.filter((m) => m.thumb === "up").length, down: bot.filter((m) => m.thumb === "down").length };
}

/** Builds the row saved to Supabase. Order fields stay null until the student pressed Confirm. */
export function summarizeSession(
  state: ChatState,
  messages: ChatMessage[],
  feedback: { rating: number | null; comment: string; testerLabel: string }
): SessionRow {
  const { up, down } = thumbTally(messages);
  const rating = feedback.rating && feedback.rating >= 1 && feedback.rating <= 5 ? Math.round(feedback.rating) : null;
  return {
    tester_label: redact(feedback.testerLabel.trim()).slice(0, 40) || null,
    outcome: outcomeOf(state),
    handoff_reason: state.handoffReason ? redact(state.handoffReason) : null,
    intake: state.confirmed
      ? { order_text: state.orderText, pickup_time: state.pickupTime, pickup_point: state.pickupPoint, allergy_note: state.allergyNote }
      : null,
    parsed_order: state.confirmed ? state.items : null,
    transcript: messages.map((m) => ({ role: m.role, text: redact(m.text), thumb: m.role === "bot" ? (m.thumb ?? null) : null })),
    guardrails: state.guardrails,
    thumbs_up: up,
    thumbs_down: down,
    rating,
    comment: redact(feedback.comment.trim()).slice(0, 500) || null,
  };
}

// --- Chat logic checks (shown on /chat) -------------------------------------------------

export type ChatCheck = { name: string; expected: string; actual: string; pass: boolean };

export function runConversation(messages: string[]): { state: ChatState; replies: Reply[]; flags: GuardrailId[][]; shown: string[] } {
  let state = initialState();
  const replies: Reply[] = [];
  const flags: GuardrailId[][] = [];
  const shown: string[] = [];
  for (const m of messages) {
    const r = respond(state, m);
    state = r.next;
    replies.push(...r.replies);
    flags.push(r.flags);
    shown.push(r.shownText);
  }
  return { state, replies, flags, shown };
}

// Phrases the assistant must never say: they would imply a real order, payment or safety promise.
export const BANNED_PHRASES: RegExp[] = [
  /\border (is|has been|was) (placed|sent|submitted|on its way)\b/i,
  /\bon (its|the) way\b/i,
  /\bwill (arrive|be delivered)\b/i,
  /\b(we|i) (have |'ve )?charged\b/i,
  /\bpayment (received|successful|complete)\b/i,
  /\byour food is ready\b/i,
  /\b(is|it's|it is) (safe|allergen[- ]free) for you\b/i,
  /\bguaranteed? (to be )?(safe|allergen[- ]free)\b/i,
];

export function allReplyTemplates(): string[] {
  return [...Object.values(R).map((v) => (typeof v === "function" ? v("2× Tacos") : v)), ...FAQ.map((f) => f.answer)];
}

export function runChatChecks(): ChatCheck[] {
  const checks: ChatCheck[] = [];

  // 1. Golden path
  const gold = runConversation([DEMO_EXAMPLE, "Yes", PICKUP_POINTS[0]]);
  const goldItems = describeItems(gold.state.items);
  checks.push({
    name: "1. Demo order reaches the summary",
    expected: `summary · 2× Tacos (no onions), 1× Coke · 1:00 PM · ${PICKUP_POINTS[0]}`,
    actual: `${gold.state.step} · ${goldItems} · ${gold.state.pickupTime} · ${gold.state.pickupPoint}`,
    pass:
      gold.state.step === "summary" &&
      goldItems === "2× Tacos (no onions), 1× Coke" &&
      gold.state.pickupTime === "1:00 PM" &&
      gold.state.pickupPoint === PICKUP_POINTS[0],
  });

  // 2. Time question skipped / asked
  const withTime = runConversation([DEMO_EXAMPLE]).state.step;
  const noTime = runConversation(["a burrito bowl"]).state.step;
  checks.push({
    name: "2. Time question is skipped only when the order has a time",
    expected: "with time → q2_confirm_time · without → q2_time",
    actual: `with time → ${withTime} · without → ${noTime}`,
    pass: withTime === "q2_confirm_time" && noTime === "q2_time",
  });

  // 3. Unreadable order twice → hand-off
  const unreadable = "I don't really know what I want to eat today honestly";
  const lost = runConversation([unreadable, unreadable]).state;
  checks.push({
    name: "3. Unreadable order twice → hand-off",
    expected: "outcome handoff",
    actual: `outcome ${outcomeOf(lost)}${lost.handoffReason ? ` (${lost.handoffReason})` : ""}`,
    pass: outcomeOf(lost) === "handoff",
  });

  // 4. Allergy
  const allergy = runConversation(["2 tacos, I'm allergic to peanuts"]);
  const allergyReply = allergy.replies.find((r) => r.guardrail === "G1_allergy");
  checks.push({
    name: "4. Allergy → no safety promise, note kept, hand-off",
    expected: "G1 reply · note kept · 1 item · handoff",
    actual: `${allergyReply ? "G1 reply" : "no G1"} · ${allergy.state.allergyNote ? "note kept" : "no note"} · ${allergy.state.items.length} item · ${outcomeOf(allergy.state)}`,
    pass: Boolean(allergyReply) && Boolean(allergy.state.allergyNote) && allergy.state.items.length === 1 && outcomeOf(allergy.state) === "handoff",
  });

  // 5. Normal orders trigger nothing
  const normal = [DEMO_EXAMPLE, "One burrito bowl at 12:30, extra guac", "3 waters and a salad, ready by noon"].map((m) => detectGuardrails(m));
  checks.push({
    name: "5. Normal orders trigger no guardrail",
    expected: "0 guardrails",
    actual: `${normal.flat().length} guardrails${normal.flat().length ? `: ${normal.flat().join(", ")}` : ""}`,
    pass: normal.flat().length === 0,
  });

  // 6. Card number
  const card = runConversation(["my card is 4242 4242 4242 4242"]);
  checks.push({
    name: "6. Card number → refused and removed",
    expected: "G2 · digits removed",
    actual: `${card.flags[0].includes("G2_payment") ? "G2" : "no G2"} · "${card.shown[0]}"`,
    pass: card.flags[0].includes("G2_payment") && !/\d{4}/.test(card.shown[0]) && card.shown[0].includes("[card number removed]"),
  });

  // 7. Email + phone
  const pii = redact("text me at 55 1234 5678 or jose@example.com");
  checks.push({
    name: "7. Email and phone are removed",
    expected: "[phone removed] · [email removed]",
    actual: pii,
    pass: pii.includes("[phone removed]") && pii.includes("[email removed]") && !pii.includes("@") && !/\d{4}/.test(pii),
  });

  // 8. Other guardrails each fire
  const samples: [GuardrailId, string][] = [
    ["G4_off_topic", "can you write my essay for history"],
    ["G5_abuse", "you are stupid"],
    ["G6_over_claim", "is my order on its way?"],
    ["G7_human", "I want to talk to a human"],
    ["G8_too_long", "a".repeat(MAX_MESSAGE_LENGTH + 1)],
  ];
  const fired = samples.filter(([id, msg]) => detectGuardrails(msg).includes(id)).map(([id]) => id.slice(0, 2));
  checks.push({
    name: "8. Guardrails G4–G8 each fire on a sample",
    expected: "G4 G5 G6 G7 G8",
    actual: fired.join(" ") || "none",
    pass: fired.length === samples.length,
  });

  // 9. FAQ official
  const official = runConversation(["Is this official IBERO?"]).replies[0]?.text ?? "";
  checks.push({
    name: "9. \"Is this official?\" → not affiliated",
    expected: "mentions not affiliated",
    actual: official.slice(0, 70) + (official.length > 70 ? "…" : ""),
    pass: /not affiliated/i.test(official),
  });

  // 10. FAQ pricing matches /pricing data
  const price = runConversation(["How much does it cost?"]).replies[0]?.text ?? "";
  const wantPrices = TIERS.map((t) => `$${t.price}`);
  checks.push({
    name: "10. Pricing answer matches /pricing",
    expected: wantPrices.join(" · "),
    actual: wantPrices.map((p) => (price.includes(p) ? p : `missing ${p}`)).join(" · "),
    pass: wantPrices.every((p) => price.includes(p)),
  });

  // 11. Two unknowns → hand-off (after a confirmed order)
  const unk = runConversation([DEMO_EXAMPLE, "Yes", PICKUP_POINTS[0], "Confirm", "banana phone", "purple elephants"]);
  checks.push({
    name: "11. Two unknown messages in a row → hand-off",
    expected: "outcome handoff",
    actual: `outcome ${outcomeOf(unk.state)}`,
    pass: outcomeOf(unk.state) === "handoff",
  });

  // 12. Banned phrases
  const templates = allReplyTemplates();
  const hits = templates.filter((t) => BANNED_PHRASES.some((re) => re.test(t)));
  checks.push({
    name: "12. No reply claims a real order, payment or safety",
    expected: `0 of ${templates.length} replies`,
    actual: hits.length ? `${hits.length}: "${hits[0].slice(0, 50)}…"` : `0 of ${templates.length} replies`,
    pass: hits.length === 0,
  });

  // 13. Nothing saved before Confirm
  const fb = { rating: null, comment: "", testerLabel: "" };
  const before = summarizeSession(gold.state, [], fb);
  const confirmed = runConversation([DEMO_EXAMPLE, "Yes", PICKUP_POINTS[0], "Confirm"]).state;
  const after = summarizeSession(confirmed, [], fb);
  checks.push({
    name: "13. Order is saved only after Confirm",
    expected: "before: no order · after: 2 items, confirmed",
    actual: `before: ${before.parsed_order ? "order saved" : "no order"} · after: ${after.parsed_order?.length ?? 0} items, ${after.outcome}`,
    pass: before.parsed_order === null && before.intake === null && after.parsed_order?.length === 2 && after.outcome === "confirmed",
  });

  // 14. Thumbs + rating math
  const msgs: ChatMessage[] = [
    { id: 1, role: "bot", text: "a", thumb: "up" },
    { id: 2, role: "student", text: "b", thumb: "up" },
    { id: 3, role: "bot", text: "c", thumb: "down" },
    { id: 4, role: "bot", text: "d", thumb: "up" },
    { id: 5, role: "bot", text: "e", thumb: null },
  ];
  const row = summarizeSession(confirmed, msgs, { rating: 9, comment: "", testerLabel: "" });
  const row4 = summarizeSession(confirmed, msgs, { rating: 4, comment: "", testerLabel: "" });
  checks.push({
    name: "14. Thumbs and rating are counted correctly",
    expected: "👍 2 · 👎 1 · rating 9 → none · rating 4 → 4",
    actual: `👍 ${row.thumbs_up} · 👎 ${row.thumbs_down} · rating 9 → ${row.rating ?? "none"} · rating 4 → ${row4.rating}`,
    pass: row.thumbs_up === 2 && row.thumbs_down === 1 && row.rating === null && row4.rating === 4,
  });

  // 15. Week 5 fix: leftover words after a removed card number aren't read as food
  const leftover = runConversation(["I'm allergic to peanuts and my card is 4242 4242 4242 4242"]).state;
  checks.push({
    name: "15. Words left after a removed card number aren't read as food",
    expected: "0 items · still on question 1",
    actual: `${leftover.items.length} items${leftover.items.length ? ` (${describeItems(leftover.items)})` : ""} · ${leftover.step}`,
    pass: leftover.items.length === 0 && leftover.step === "q1_order",
  });

  // 16. Week 5 fix: "2 tacos" at the time question isn't read as 2:00 PM
  const notTime = runConversation(["a burrito bowl", "2 tacos"]).state;
  const realTimes = ["1pm", "12:30", "at 2", "around 1 pm", "noon"].map(parseTimeAnswer);
  checks.push({
    name: "16. \"2 tacos\" at the time question isn't read as 2:00 PM",
    expected: "time not set · real times still work (5 of 5)",
    actual: `time ${notTime.pickupTime ?? "not set"} · real times ${realTimes.filter(Boolean).length} of 5`,
    pass: notTime.pickupTime === null && notTime.step === "q2_time" && realTimes.every(Boolean),
  });

  return checks;
}
