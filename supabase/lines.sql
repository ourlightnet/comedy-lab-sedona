-- Opening Lines for comedylabsedona.com/lines.html
-- Run once in Supabase: SQL Editor → New query → paste → Run.

create table public.lines (
  id bigint generated always as identity primary key,
  text text not null check (char_length(text) between 10 and 280),
  name text check (char_length(name) <= 60),
  city text check (char_length(city) <= 60),
  created_at timestamptz not null default now(),
  hidden boolean not null default false   -- set true in the Table Editor to remove a line
);

create table public.line_votes (
  line_id bigint not null references public.lines(id) on delete cascade,
  voter uuid not null,
  value smallint not null check (value in (-1, 1)),
  primary key (line_id, voter)
);

alter table public.lines enable row level security;
alter table public.line_votes enable row level security;

-- Visitors can add lines but not edit, hide or delete them.
create policy "anyone can add a line" on public.lines
  for insert to anon with check (hidden = false);

-- Votes only go through cast_vote below, never directly.

create view public.lines_ranked as
  select l.id, l.text, l.name, l.city, l.created_at,
         coalesce(sum(v.value), 0)::int as score
  from public.lines l
  left join public.line_votes v on v.line_id = l.id
  where not l.hidden
  group by l.id;

create function public.cast_vote(p_line bigint, p_voter uuid, p_value int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_value = 0 then
    delete from line_votes where line_id = p_line and voter = p_voter;
  elsif p_value in (-1, 1) then
    insert into line_votes (line_id, voter, value) values (p_line, p_voter, p_value)
    on conflict (line_id, voter) do update set value = excluded.value;
  end if;
end $$;

create function public.my_votes(p_voter uuid)
returns table (line_id bigint, value smallint)
language sql security definer set search_path = public as $$
  select line_id, value from line_votes where voter = p_voter;
$$;

grant insert on public.lines to anon;
grant select on public.lines_ranked to anon;
grant execute on function public.cast_vote(bigint, uuid, int) to anon;
grant execute on function public.my_votes(uuid) to anon;

-- Starting lines
insert into public.lines (text, name, city) values
  ('Welcome to the simulation theory help line, where we care about your reality. How may I help you?', 'The Comedy Lab', 'Sedona'),
  ('My dead grandmother showed up in my kitchen last night and tried to explain the dimensions to me using a pizza.', 'The Comedy Lab', 'Sedona');
