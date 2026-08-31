-- Week 1 — Generative Core Agent: core_outputs table
-- Run this in Supabase Dashboard → your project → SQL Editor → New query → Run.

create table if not exists core_outputs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  raw_input text not null,
  restaurant text,
  items jsonb not null default '[]'::jsonb,
  pickup_time_raw text,
  pickup_time_iso timestamptz,
  special_instructions text
);

-- Row Level Security is on by default for new tables. Week 1 has no login
-- system yet (see Scope Cuts), so we allow the anon key — the same public
-- key already in your .env.local / Vercel env vars — to insert and read
-- rows directly. This is a known, documented simplification, not an
-- oversight: real user-scoped access control is out of scope until an
-- auth system exists in a later week.
alter table core_outputs enable row level security;

create policy "Allow anon insert on core_outputs"
  on core_outputs for insert
  to anon
  with check (true);

create policy "Allow anon select on core_outputs"
  on core_outputs for select
  to anon
  using (true);
