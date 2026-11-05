"use client";

import { useState, type ReactNode } from "react";
import {
  initialState,
  openingReplies,
  respond,
  summarizeSession,
  type ChatMessage,
  type ChatState,
  type Reply,
} from "@/lib/chat";
import { saveSession } from "@/lib/supabaseChat";
import ChatWindow from "@/components/chat/ChatWindow";
import SessionFeedback from "@/components/chat/SessionFeedback";
import { HandoffList, RecentSessions } from "@/components/chat/SessionLists";
import ChatChecks from "@/components/chat/ChatChecks";
import ExternalTests from "@/components/chat/ExternalTests";

type Zone = "Input + output" | "Input" | "Saved" | "Testing";

const ZONE_CLASS: Record<Zone, string> = {
  "Input + output": "bg-red-600/10 text-red-700 dark:text-red-400",
  Input: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Saved: "bg-green-700/10 text-green-800 dark:text-green-400",
  Testing: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
};

function Section({ id, title, zone, children }: { id: string; title: string; zone: Zone; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-black/10 pt-8 dark:border-white/10">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 id={`${id}-h`} className="text-xl font-semibold">
          {title}
        </h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ZONE_CLASS[zone]}`}>{zone}</span>
      </div>
      {children}
    </section>
  );
}

let nextId = 1;
const toMessages = (replies: Reply[]): ChatMessage[] =>
  replies.map((r) => ({ id: nextId++, role: "bot", text: r.text, chips: r.chips, summary: r.summary, guardrail: r.guardrail, thumb: null }));

let sessionCount = 0;
function freshChat(): { session: number; state: ChatState; messages: ChatMessage[] } {
  return { session: sessionCount++, state: initialState(), messages: toMessages(openingReplies()) };
}

export default function ChatPage() {
  const [chat, setChat] = useState(freshChat);
  const [refreshKey, setRefreshKey] = useState(0);

  function send(text: string) {
    setChat((c) => {
      const r = respond(c.state, text);
      const student: ChatMessage = { id: nextId++, role: "student", text: r.shownText };
      return { ...c, state: r.next, messages: [...c.messages, student, ...toMessages(r.replies)] };
    });
  }

  function thumb(id: number, t: "up" | "down") {
    setChat((c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === id ? { ...m, thumb: m.thumb === t ? null : t } : m)),
    }));
  }

  async function save(fb: { rating: number | null; comment: string; testerLabel: string }) {
    const err = await saveSession(summarizeSession(chat.state, chat.messages, fb));
    if (!err) setRefreshKey((k) => k + 1);
    return err;
  }

  const showPointsNote = chat.state.step === "q3_point";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Week 5 · Guided assistant</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Public Chatbot / Guided Assistant</h1>
        <p className="mt-2 max-w-2xl text-black/70 dark:text-white/60">
          Three quick questions (what, when, where) turn into a pickup order you confirm yourself. Then ask anything about IBEROGO.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="rounded-lg border border-red-600/30 bg-red-600/5 px-3 py-2">
            <strong>Simulated assistant:</strong> rule-based, no AI API. This is a prototype: no order is sent to a kitchen and nothing is
            charged.
          </p>
          <p className="rounded-lg border border-black/10 px-3 py-2 text-black/70 dark:border-white/10 dark:text-white/60">
            Please don&apos;t type personal info. Saved test sessions are visible on this page.
          </p>
        </div>
      </header>

      <div className="space-y-10">
        <Section id="assistant" title="Assistant" zone="Input + output">
          <ChatWindow
            messages={chat.messages}
            onSend={send}
            onThumb={thumb}
            onRestart={() => setChat(freshChat())}
            showPointsNote={showPointsNote}
          />
        </Section>

        <Section id="feedback" title="Feedback" zone="Input">
          <SessionFeedback key={chat.session} state={chat.state} messages={chat.messages} onSave={save} />
        </Section>

        <div className="grid gap-10 md:grid-cols-[1fr_280px]">
          <Section id="sessions" title="Recent test sessions" zone="Saved">
            <RecentSessions refreshKey={refreshKey} />
          </Section>
          <Section id="handoff" title="Needs human review" zone="Saved">
            <HandoffList refreshKey={refreshKey} />
          </Section>
        </div>

        <Section id="checks" title="Chat logic checks" zone="Testing">
          <ChatChecks />
        </Section>

        <Section id="external" title="External user tests" zone="Testing">
          <ExternalTests />
        </Section>
      </div>
    </div>
  );
}
