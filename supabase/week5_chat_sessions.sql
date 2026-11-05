-- IBEROGO Week 5: public chatbot / guided assistant
-- Run once in the Supabase SQL Editor. Same anon insert/select RLS pattern as Weeks 1–4.
-- Transcripts are redacted in the browser (card numbers, emails, phones) BEFORE they are inserted.

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tester_label text,                       -- e.g. 'Tester 1' (no real names needed)
  outcome text not null check (outcome in ('confirmed', 'handoff', 'incomplete')),
  handoff_reason text,                     -- why a person needs to review it
  intake jsonb,                            -- order text, pickup time, pickup point, allergy note (only after Confirm)
  parsed_order jsonb,                      -- items from the Week 1 parser (only after Confirm)
  transcript jsonb not null,               -- [{ role, text, thumb }], redacted
  guardrails text[] not null default '{}', -- e.g. {G1_allergy, G2_payment}
  thumbs_up int not null default 0 check (thumbs_up >= 0),
  thumbs_down int not null default 0 check (thumbs_down >= 0),
  rating int check (rating between 1 and 5),
  comment text
);

alter table public.chat_sessions enable row level security;

create policy "anon can insert chat sessions"
  on public.chat_sessions for insert
  to anon
  with check (true);

create policy "anon can read chat sessions"
  on public.chat_sessions for select
  to anon
  using (true);
