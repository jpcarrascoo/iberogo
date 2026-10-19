-- IBEROGO Week 4: marketing engine
-- Run once in the Supabase SQL Editor. Same anon insert/select RLS pattern as Weeks 1–3.

-- 1) Marketing assets saved from /marketing (library posts/scripts/copy, or your own drafts)
create table if not exists public.marketing_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('post', 'script', 'copy', 'custom')),
  asset_id text,            -- e.g. 'P1', 'V2', 'LANDING-ES'; null for custom drafts
  title text not null,
  channel text,
  body text not null
);

alter table public.marketing_assets enable row level security;

create policy "anon can insert marketing assets"
  on public.marketing_assets for insert
  to anon
  with check (true);

create policy "anon can read marketing assets"
  on public.marketing_assets for select
  to anon
  using (true);

-- 2) A/B test votes recorded in person with real students
create table if not exists public.ab_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  test_id text not null check (test_id in ('AB1', 'AB2')),
  choice text not null check (choice in ('A', 'B')),
  variant_text text not null,
  reason text
);

alter table public.ab_votes enable row level security;

create policy "anon can insert ab votes"
  on public.ab_votes for insert
  to anon
  with check (true);

create policy "anon can read ab votes"
  on public.ab_votes for select
  to anon
  using (true);
