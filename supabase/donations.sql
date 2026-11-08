-- Card gifts for the Fund page total. Run once in Supabase: SQL Editor → New query → paste → Run.
-- The stripe-webhook function adds a row for each paid checkout. Visitors can
-- only read the total and count, never the individual rows.

create table public.donations (
  id bigint generated always as identity primary key,
  session_id text not null unique,
  amount numeric(10,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);
alter table public.donations enable row level security;

create view public.donations_total as
  select coalesce(sum(amount), 0)::numeric(10,2) as total, count(*)::int as n
  from public.donations;

grant select on public.donations_total to anon;
