-- Week 2 — Research + Benchmarking Dashboard
-- Run this in Supabase's SQL Editor (same project as Week 0/1).

create table if not exists research_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  notes text,
  category text
);

alter table research_entries enable row level security;

-- No auth system exists yet (documented scope cut from Week 0/1) —
-- same anon-role policy pattern as core_outputs.
create policy "Allow anon insert on research_entries"
  on research_entries for insert
  to anon
  with check (true);

create policy "Allow anon select on research_entries"
  on research_entries for select
  to anon
  using (true);
