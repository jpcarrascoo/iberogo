// Week 6 — Practical impact check: does IBEROGO create value, and does it avoid obvious harm?
//
// Value comes ONLY from real /demo runs (see valueSummary). Harm is a fixed checklist:
// every risk names what IBEROGO does about it and the automatic check that proves it.

import type { GuardrailId } from "./chat";

export type HarmRow = {
  id: string;
  risk: string;
  mitigation: string;
  /** The logic check that proves the mitigation works, e.g. { suite: "chat", number: 4 }. */
  evidence: { suite: "chat" | "demo"; number: number };
  /** Guardrails that, when a real tester triggers them, show the mitigation was exercised live. */
  guardrails: GuardrailId[];
};

export const HARM_CHECKLIST: HarmRow[] = [
  {
    id: "allergy",
    risk: "A student with an allergy trusts the app to keep them safe.",
    mitigation: "The assistant never promises allergen safety, keeps the note on the order and hands the chat to a person (G1).",
    evidence: { suite: "chat", number: 4 },
    guardrails: ["G1_allergy"],
  },
  {
    id: "payment",
    risk: "A student pastes a card number into the chat.",
    mitigation: "The card number is refused and removed before it's shown or saved (G2). There is no payment form anywhere.",
    evidence: { suite: "chat", number: 6 },
    guardrails: ["G2_payment"],
  },
  {
    id: "personal",
    risk: "A student shares an email or phone number.",
    mitigation: "Emails and phone numbers are removed before saving, in the chat and in the /demo survey (G3).",
    evidence: { suite: "chat", number: 7 },
    guardrails: ["G3_personal_data"],
  },
  {
    id: "overclaim",
    risk: "A student believes a real order was placed, paid for or is on its way.",
    mitigation: "Every page says it's a prototype; G6 answers \"is my order real?\" honestly; no reply may claim a real order.",
    evidence: { suite: "chat", number: 12 },
    guardrails: ["G6_over_claim"],
  },
  {
    id: "official",
    risk: "A student thinks IBEROGO is an official Universidad Iberoamericana service.",
    mitigation: "The FAQ answer and every page footer say it is a student project, not affiliated with the university.",
    evidence: { suite: "chat", number: 9 },
    guardrails: [],
  },
  {
    id: "stuck",
    risk: "A student with a complaint or a confusing order gets stuck with a bot.",
    mitigation: "\"Talk to a human\", complaints and 2 unanswered messages flag the chat for a person (G7 + fallback).",
    evidence: { suite: "chat", number: 11 },
    guardrails: ["G7_human"],
  },
  {
    id: "abuse",
    risk: "The assistant is pushed off-topic or insulted.",
    mitigation: "Off-topic requests get a short redirect (G4); abuse gets a calm one-line boundary (G5).",
    evidence: { suite: "chat", number: 8 },
    guardrails: ["G4_off_topic", "G5_abuse"],
  },
  {
    id: "tester-privacy",
    risk: "Test data identifies a real tester.",
    mitigation: "Testers use labels (\"Tester 4\"), never names; the /demo survey's free text is redacted before saving.",
    evidence: { suite: "demo", number: 6 },
    guardrails: [],
  },
];

/** How many real /demo chat sessions triggered each harm row's guardrails. */
export function harmExercised(demoSessions: { guardrails: string[] | null }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of HARM_CHECKLIST) {
    out[row.id] = demoSessions.filter((s) => (s.guardrails ?? []).some((g) => row.guardrails.includes(g as GuardrailId))).length;
  }
  return out;
}
