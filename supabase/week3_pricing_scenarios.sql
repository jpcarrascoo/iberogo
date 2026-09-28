-- IBEROGO Week 3: saved pricing scenarios
create table if not exists public.pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  scenario text not null,
  inputs jsonb not null,
  monthly_revenue numeric not null,
  annual_revenue numeric not null
);

alter table public.pricing_scenarios enable row level security;

create policy "anon can insert pricing scenarios"
  on public.pricing_scenarios for insert
  to anon
  with check (true);

create policy "anon can read pricing scenarios"
  on public.pricing_scenarios for select
  to anon
  using (true);
