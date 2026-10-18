-- Run this in Supabase → SQL Editor (safe to run more than once; do NOT re-run schema.sql).
-- Adds the table that stores your Projects, Experience, Achievements and Skills.
-- It uses the existing is_owner() function, so your owner email stays as it is.

create table if not exists public.portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('project','experience','achievement','skill')),
  data       jsonb not null default '{}'::jsonb,
  position   bigint not null default 0,
  created_at timestamptz not null default now()
);
-- (for tables created by an earlier version of this file: allow the 'skill' kind too)
alter table public.portfolio_items drop constraint if exists portfolio_items_kind_check;
alter table public.portfolio_items add constraint portfolio_items_kind_check
  check (kind in ('project','experience','achievement','skill'));

create index if not exists portfolio_items_kind_pos on public.portfolio_items (kind, position desc);

alter table public.portfolio_items enable row level security;

drop policy if exists "items read"   on public.portfolio_items;
drop policy if exists "items insert" on public.portfolio_items;
drop policy if exists "items update" on public.portfolio_items;
drop policy if exists "items delete" on public.portfolio_items;

create policy "items read"   on public.portfolio_items for select using (true);
create policy "items insert" on public.portfolio_items for insert with check (public.is_owner());
create policy "items update" on public.portfolio_items for update using (public.is_owner()) with check (public.is_owner());
create policy "items delete" on public.portfolio_items for delete using (public.is_owner());

grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;
