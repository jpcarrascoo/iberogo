-- Week 6 — Integrated Agentic Venture + Impact & Viability
-- Run once in the Supabase SQL Editor BEFORE deploying the Week 6 code
-- (the Week 6 /chat and /demo save the two new chat_sessions columns).

-- 1. One row per finished /demo walkthrough.
create table if not exists public.demo_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tester_label text,                                   -- e.g. 'Tester 4' (no real names)
  chat_session_id uuid references public.chat_sessions (id),
  order_text text,                                     -- step 2, redacted
  checklist jsonb not null,                            -- { order, question, guardrail, thumbs } ticked from real chat events
  skipped text[] not null default '{}',                -- checklist items the tester skipped
  plan_choice text,                                    -- 'Basic' | 'Plus' | 'Campus Pass' | 'None'
  minutes_in_line int check (minutes_in_line between 0 and 60),
  would_use text check (would_use in ('yes', 'maybe', 'no')),
  usefulness int check (usefulness between 1 and 5),
  missing text,                                        -- "What's missing?", redacted
  harm_concern text,                                   -- "Anything unsafe or misleading?", redacted
  completed boolean not null default false
);

alter table public.demo_runs enable row level security;

create policy "anon can insert demo runs"
  on public.demo_runs for insert
  to anon
  with check (true);

create policy "anon can read demo runs"
  on public.demo_runs for select
  to anon
  using (true);

-- 2. Week 5 chat sessions: record FAQ questions and where the chat happened.
alter table public.chat_sessions add column if not exists faq_intents text[] not null default '{}';
alter table public.chat_sessions add column if not exists source text not null default 'chat';
alter table public.chat_sessions drop constraint if exists chat_sessions_source_check;
alter table public.chat_sessions add constraint chat_sessions_source_check check (source in ('chat', 'demo'));
