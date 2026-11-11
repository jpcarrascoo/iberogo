"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  initialState,
  openingReplies,
  respond,
  summarizeSession,
  cleanOrderText,
  extractPickupPoint,
  type ChatMessage,
  type ChatState,
  type Reply,
} from "@/lib/chat";
import { parseOrderText, type ParsedOrder } from "@/lib/parseOrder";
import {
  CHECKLIST_ITEMS,
  DEMO_COPY,
  DEMO_ORDER,
  DEMO_STEPS,
  EMPTY_SURVEY,
  PLAN_CHOICES,
  SURVEY_TEXT_MAX,
  buildDemoRun,
  checklistDone,
  checklistFromChat,
  runDemoChecks,
  validateSurvey,
  type Checklist,
  type ChecklistKey,
  type Survey,
  type WouldUse,
} from "@/lib/demo";
import { TIERS } from "@/lib/pricing";
import { saveSession } from "@/lib/supabaseChat";
import { saveDemoRun } from "@/lib/supabaseDemo";
import ChatWindow from "@/components/chat/ChatWindow";
import AgentMap from "@/components/demo/AgentMap";
import RoadmapV2 from "@/components/demo/RoadmapV2";
import { ImpactCheck, TestingSummaryPanel, useDemoData } from "@/components/demo/Results";
import ChecksList from "@/components/ChecksList";
import Section from "@/components/Section";
import { BTN, BTN_PRIMARY } from "@/components/marketing/actions";

// --- Chat helpers (same as /chat) -------------------------------------------------------

let nextId = 1;
const toMessages = (replies: Reply[]): ChatMessage[] =>
  replies.map((r) => ({ id: nextId++, role: "bot", text: r.text, chips: r.chips, summary: r.summary, guardrail: r.guardrail, thumb: null }));

type Chat = { state: ChatState; messages: ChatMessage[] };
const freshChat = (): Chat => ({ state: initialState(), messages: toMessages(openingReplies()) });
const NO_TICKS: Checklist = { order: false, question: false, guardrail: false, thumbs: false };
const mergeTicks = (a: Checklist, b: Checklist): Checklist => ({
  order: a.order || b.order,
  question: a.question || b.question,
  guardrail: a.guardrail || b.guardrail,
  thumbs: a.thumbs || b.thumbs,
});

const INPUT = "mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20";

// --- Page ---------------------------------------------------------------------------------

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [testerLabel, setTesterLabel] = useState("");
  const [orderDraft, setOrderDraft] = useState("");
  const [parsed, setParsed] = useState<{ text: string; order: ParsedOrder; point: string | null } | null>(null);
  const [chat, setChat] = useState<Chat>(freshChat);
  // Ticks are kept even if the tester presses "Start over" in the chat.
  const [ticks, setTicks] = useState<Checklist>(NO_TICKS);
  const [skipped, setSkipped] = useState<ChecklistKey[]>([]);
  const [plan, setPlan] = useState<string | null>(null);
  const [survey, setSurvey] = useState<Survey>(EMPTY_SURVEY);
  const [minutesText, setMinutesText] = useState("");
  const [save, setSave] = useState<{ status: "idle" | "saving" | "saved" | "error"; error: string }>({ status: "idle", error: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useDemoData(refreshKey);
  const checks = useMemo(() => runDemoChecks(), []);

  const surveyErrors = validateSurvey(survey);
  const chatDone = checklistDone(ticks, skipped);
  const current = DEMO_STEPS[step];

  function updateChat(next: Chat) {
    setChat(next);
    setTicks((t) => mergeTicks(t, checklistFromChat(next.state, next.messages)));
  }

  function send(text: string) {
    const r = respond(chat.state, text);
    const student: ChatMessage = { id: nextId++, role: "student", text: r.shownText };
    updateChat({ state: r.next, messages: [...chat.messages, student, ...toMessages(r.replies)] });
  }

  function thumb(id: number, t: "up" | "down") {
    updateChat({ ...chat, messages: chat.messages.map((m) => (m.id === id ? { ...m, thumb: m.thumb === t ? null : t } : m)) });
  }

  function readOrder() {
    const t = orderDraft.trim();
    if (!t) return;
    const found = extractPickupPoint(cleanOrderText(t));
    setParsed({ text: t, order: parseOrderText(found.rest), point: found.point });
  }

  function toggleSkip(k: ChecklistKey) {
    setSkipped((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  async function saveRun() {
    setSave({ status: "saving", error: "" });
    let chatSessionId: string | null = null;
    if (chat.messages.some((m) => m.role === "student")) {
      const r = await saveSession(summarizeSession(chat.state, chat.messages, { rating: null, comment: "", testerLabel }, "demo"));
      if (r.error) {
        setSave({ status: "error", error: r.error });
        return;
      }
      chatSessionId = r.id;
    }
    const err = await saveDemoRun(
      buildDemoRun({ testerLabel, chatSessionId, orderText: parsed?.text ?? "", checklist: ticks, skipped, planChoice: plan, survey })
    );
    if (err) {
      setSave({ status: "error", error: err });
      return;
    }
    setSave({ status: "saved", error: "" });
    setRefreshKey((k) => k + 1);
  }

  function newRun() {
    setStep(0);
    setTesterLabel("");
    setOrderDraft("");
    setParsed(null);
    setChat(freshChat());
    setTicks(NO_TICKS);
    setSkipped([]);
    setPlan(null);
    setSurvey(EMPTY_SURVEY);
    setMinutesText("");
    setSave({ status: "idle", error: "" });
  }

  // Why "Next" is disabled, shown next to the button.
  const blocker =
    current.id === "assistant" && !chatDone
      ? "Do or skip all 4 items to continue."
      : current.id === "plan" && !plan
        ? "Pick one option to continue."
        : current.id === "impact" && surveyErrors.length
          ? surveyErrors[0]
          : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Week 6 · Integrated venture</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">IBEROGO in 5 minutes</h1>
        <p className="mt-2 max-w-2xl text-black/70 dark:text-white/60">{DEMO_COPY.intro}</p>
        <p className="mt-3 rounded-lg border border-red-600/30 bg-red-600/5 px-3 py-2 text-sm">
          <strong>Simulated parts are labeled.</strong> The order parser and the assistant are rule-based, with no AI API. Your run is
          saved with a tester label only.
        </p>
      </header>

      {/* ---------------- Guided walkthrough ---------------- */}
      <section aria-labelledby="walkthrough-h" className="rounded-xl border border-black/10 p-4 sm:p-6 dark:border-white/10">
        <h2 id="walkthrough-h" className="sr-only">
          Guided walkthrough
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold" data-testid="step-label">
            Step {step + 1} of {DEMO_STEPS.length} · {current.title}
          </p>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Input
          </span>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {DEMO_STEPS.map((s, i) => (
            <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-red-600" : "bg-black/10 dark:bg-white/15"}`} />
          ))}
        </div>

        <div className="mt-6">
          {current.id === "problem" && (
            <div className="space-y-4">
              <ul className="space-y-2">
                {DEMO_COPY.problem.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-black/50 dark:text-white/40">{DEMO_COPY.problemSource}</p>
              <label className="block max-w-xs text-sm">
                <span className="font-medium">Tester label (optional)</span>
                <input
                  id="demo-tester-label"
                  value={testerLabel}
                  onChange={(e) => setTesterLabel(e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Tester 4 (no real names)"
                  className={INPUT}
                />
              </label>
            </div>
          )}

          {current.id === "order" && (
            <div className="space-y-3">
              <p>{DEMO_COPY.orderTask}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  readOrder();
                }}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <label htmlFor="demo-order" className="sr-only">
                  Your order
                </label>
                <input
                  id="demo-order"
                  value={orderDraft}
                  onChange={(e) => setOrderDraft(e.target.value)}
                  maxLength={500}
                  placeholder={`e.g. ${DEMO_ORDER}`}
                  className={`${INPUT} mt-0 flex-1`}
                />
                <button type="submit" disabled={!orderDraft.trim()} className={BTN_PRIMARY}>
                  Read my order
                </button>
              </form>
              {parsed && (
                <div className="rounded-lg border border-black/15 p-4 text-sm dark:border-white/15" data-testid="demo-parsed">
                  <p className="mb-2 inline-block rounded-full bg-amber-600/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                    Output · simulated, rule-based parser
                  </p>
                  {parsed.order.items.length === 0 ? (
                    <p className="text-black/60 dark:text-white/50">No items found. Try something like &ldquo;2 tacos and a coke&rdquo;.</p>
                  ) : (
                    <ul className="space-y-1">
                      {parsed.order.items.map((it, i) => (
                        <li key={i}>
                          <span className="font-semibold">{it.quantity}×</span> {it.name}
                          {it.notes && <span className="text-black/50 dark:text-white/40"> (note: {it.notes})</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-black/70 dark:text-white/60">
                    Pickup time:{" "}
                    {parsed.order.pickupTimeIso
                      ? new Date(parsed.order.pickupTimeIso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                      : "not given"}
                    {" · "}Pickup point: {parsed.point ?? "not given"}
                  </p>
                </div>
              )}
              <p className="text-xs text-black/50 dark:text-white/40">{DEMO_COPY.orderNote}</p>
            </div>
          )}

          {current.id === "assistant" && (
            <div className="space-y-4">
              <p>{DEMO_COPY.chatTask}</p>
              <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">{DEMO_COPY.chatSafety}</p>
              <ul className="grid gap-2 sm:grid-cols-2" data-testid="demo-checklist">
                {CHECKLIST_ITEMS.map((i) => {
                  const done = ticks[i.key];
                  const skip = !done && skipped.includes(i.key);
                  return (
                    <li
                      key={i.key}
                      data-testid={`tick-${i.key}`}
                      data-done={done ? "yes" : "no"}
                      className={`rounded-lg border p-3 text-sm ${done ? "border-green-700/40 bg-green-700/5" : "border-black/10 dark:border-white/10"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">
                          <span aria-hidden="true">{done ? "✅" : skip ? "⏭️" : "⬜"}</span> {i.label}
                          <span className="sr-only">{done ? " (done)" : skip ? " (skipped)" : " (not done yet)"}</span>
                        </p>
                        {!done && (
                          <button type="button" onClick={() => toggleSkip(i.key)} className="text-xs text-black/50 underline dark:text-white/40">
                            {skip ? "Undo skip" : "Skip"}
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 text-black/60 dark:text-white/50">{i.hint}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-black/50 dark:text-white/40">
                The boxes tick themselves when it really happens in the chat. You can&apos;t tick them by clicking; you can only skip one.
              </p>
              <ChatWindow
                messages={chat.messages}
                onSend={send}
                onThumb={thumb}
                onRestart={() => setChat(freshChat())}
                showPointsNote={chat.state.step === "q3_point"}
              />
            </div>
          )}

          {current.id === "plan" && (
            <fieldset className="space-y-3">
              <legend className="mb-3">{DEMO_COPY.planTask}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PLAN_CHOICES.map((p) => {
                  const tier = TIERS.find((t) => t.name === p);
                  return (
                    <label
                      key={p}
                      className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm ${plan === p ? "border-red-600/60 bg-red-600/5" : "border-black/10 dark:border-white/10"}`}
                    >
                      <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} className="mt-1 accent-red-600" />
                      <span>
                        <span className="font-semibold">
                          {p}
                          {tier && <span className="font-normal text-black/60 dark:text-white/50"> · ${tier.price} MXN/month</span>}
                        </span>
                        <span className="block text-black/60 dark:text-white/50">{tier ? tier.summary : "I wouldn't pay for any of these."}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {current.id === "impact" && (
            <div className="space-y-4">
              <p>{DEMO_COPY.impactTask}</p>
              <label className="block max-w-xs text-sm">
                <span className="font-medium">On a normal campus day, how many minutes do you lose in a food line? (0–60)</span>
                <input
                  id="demo-minutes"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={60}
                  value={minutesText}
                  onChange={(e) => {
                    setMinutesText(e.target.value);
                    const n = e.target.value === "" ? null : Number(e.target.value);
                    setSurvey((s) => ({ ...s, minutes: n }));
                  }}
                  className={INPUT}
                />
              </label>
              <fieldset className="text-sm">
                <legend className="font-medium">Would you use IBEROGO if it were real?</legend>
                <div className="mt-1 flex gap-2">
                  {(["yes", "maybe", "no"] as WouldUse[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      aria-pressed={survey.wouldUse === w}
                      onClick={() => setSurvey((s) => ({ ...s, wouldUse: w }))}
                      className={survey.wouldUse === w ? BTN_PRIMARY : BTN}
                    >
                      {w[0].toUpperCase() + w.slice(1)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="text-sm">
                <legend className="font-medium">How useful would it be for you? (1 = not at all, 5 = very)</legend>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} of 5`}
                      aria-pressed={survey.usefulness === n}
                      onClick={() => setSurvey((s) => ({ ...s, usefulness: n }))}
                      className={`h-9 w-9 rounded-md border text-sm font-semibold ${survey.usefulness === n ? "border-red-600 bg-red-600 text-white" : "border-black/15 dark:border-white/20"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm">
                <span className="font-medium">What&apos;s missing, or what would stop you from using it? (optional)</span>
                <textarea
                  id="demo-missing"
                  value={survey.missing}
                  onChange={(e) => setSurvey((s) => ({ ...s, missing: e.target.value }))}
                  maxLength={SURVEY_TEXT_MAX}
                  rows={2}
                  className={INPUT}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Did anything feel unsafe or misleading? (optional)</span>
                <textarea
                  id="demo-harm"
                  value={survey.harmConcern}
                  onChange={(e) => setSurvey((s) => ({ ...s, harmConcern: e.target.value }))}
                  maxLength={SURVEY_TEXT_MAX}
                  rows={2}
                  className={INPUT}
                />
              </label>
            </div>
          )}

          {current.id === "finish" && (
            <div className="space-y-4" data-testid="demo-finish">
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
                  <dt className="text-xs text-black/50 dark:text-white/40">Tester</dt>
                  <dd className="font-semibold">{testerLabel.trim() || "Unlabeled"}</dd>
                </div>
                <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
                  <dt className="text-xs text-black/50 dark:text-white/40">Assistant checklist</dt>
                  <dd className="font-semibold">
                    {CHECKLIST_ITEMS.map((i) => `${ticks[i.key] ? "✓" : skipped.includes(i.key) ? "skipped" : "✗"} ${i.label}`).join(" · ")}
                  </dd>
                </div>
                <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
                  <dt className="text-xs text-black/50 dark:text-white/40">Plan</dt>
                  <dd className="font-semibold">{plan ?? "—"}</dd>
                </div>
                <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
                  <dt className="text-xs text-black/50 dark:text-white/40">Your answers</dt>
                  <dd className="font-semibold">
                    {survey.minutes ?? "—"} min in line · would use: {survey.wouldUse ?? "—"} · useful {survey.usefulness ?? "—"}/5
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-black/50 dark:text-white/40">{DEMO_COPY.finishNote}</p>
              {save.status === "saved" ? (
                <div className="space-y-2">
                  <p className="font-medium text-green-700 dark:text-green-400" data-testid="demo-saved">
                    Saved ✓ {DEMO_COPY.saved}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/dashboard" className={BTN_PRIMARY}>
                      Open the dashboard
                    </Link>
                    <a href="#agent-map" className={BTN}>
                      See how it fits together
                    </a>
                    <button type="button" onClick={newRun} className={BTN}>
                      Start a new run
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={saveRun} disabled={save.status === "saving"} className={BTN_PRIMARY}>
                    {save.status === "saving" ? "Saving…" : "Save my demo run"}
                  </button>
                  {save.status === "error" && <span className="text-sm text-red-600">{save.error}</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4 dark:border-white/10">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || save.status === "saved"} className={BTN}>
            ← Back
          </button>
          {step < DEMO_STEPS.length - 1 && (
            <div className="flex items-center gap-3">
              {blocker && <span className="text-xs text-black/50 dark:text-white/40">{blocker}</span>}
              <button type="button" onClick={() => setStep((s) => s + 1)} disabled={Boolean(blocker)} className={BTN_PRIMARY}>
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Evidence below the walkthrough ---------------- */}
      <div className="mt-12 space-y-10">
        <Section id="testing" title="Testing summary" zone="Saved" intro="Real external testers only (runs saved as Tester 1…5). Full records are on /dashboard.">
          <TestingSummaryPanel data={data} />
        </Section>

        <Section
          id="agent-map"
          title="Agent map: how it fits together"
          zone="Output"
          intro="Every part of IBEROGO that acts like an agent, what kind it really is, and where its data goes. No agent acts on its own: a person reviews."
        >
          <AgentMap />
        </Section>

        <Section id="impact" title="Practical impact check" zone="Testing" intro="Does it create value, and does it avoid obvious harm?">
          <ImpactCheck data={data} />
        </Section>

        <Section id="roadmap" title="Version 2 roadmap" zone="Output" intro="What comes next, in priority order, and the evidence behind each item.">
          <RoadmapV2 />
        </Section>

        <Section id="checks" title="Demo logic checks" zone="Testing" intro="These run the real /demo functions on fixed samples every time the page loads.">
          <ChecksList checks={checks} testId="demo-checks-summary" />
        </Section>
      </div>
    </div>
  );
}
