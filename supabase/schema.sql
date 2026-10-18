-- ════════════════════════════════════════════════════════════════
--  Portfolio backend for Supabase
--  Run this ONCE: Supabase dashboard → SQL Editor → New query → paste → Run
--
--  ⚠ Before running, replace YOUR_EMAIL@example.com (one place, just below)
--    with the email of the account you will log in with as the owner.
-- ════════════════════════════════════════════════════════════════

-- 1. Who is the owner? ───────────────────────────────────────────
create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = lower('YOUR_EMAIL@example.com'), false)
$$;

-- 2. Blog posts ──────────────────────────────────────────────────
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  excerpt     text not null default '',
  tags        text[] not null default '{}',
  status      text not null default 'draft' check (status in ('public', 'private', 'draft')),
  html        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_status_updated_idx on public.posts (status, updated_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

-- Visitors can only ever read PUBLIC posts. The owner can read everything.
drop policy if exists "posts: read public or owner" on public.posts;
create policy "posts: read public or owner" on public.posts
  for select using (status = 'public' or public.is_owner());

drop policy if exists "posts: owner insert" on public.posts;
create policy "posts: owner insert" on public.posts
  for insert with check (public.is_owner());

drop policy if exists "posts: owner update" on public.posts;
create policy "posts: owner update" on public.posts
  for update using (public.is_owner()) with check (public.is_owner());

drop policy if exists "posts: owner delete" on public.posts;
create policy "posts: owner delete" on public.posts
  for delete using (public.is_owner());

-- 3. Site settings (stores the current resume link) ──────────────
create table if not exists public.site_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

drop policy if exists "settings: anyone can read" on public.site_settings;
create policy "settings: anyone can read" on public.site_settings
  for select using (true);

drop policy if exists "settings: owner insert" on public.site_settings;
create policy "settings: owner insert" on public.site_settings
  for insert with check (public.is_owner());

drop policy if exists "settings: owner update" on public.site_settings;
create policy "settings: owner update" on public.site_settings
  for update using (public.is_owner()) with check (public.is_owner());

drop policy if exists "settings: owner delete" on public.site_settings;
create policy "settings: owner delete" on public.site_settings
  for delete using (public.is_owner());

-- 4. File storage: resume PDF + blog images ──────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site',        'site',        true, 10485760, array['application/pdf']),
  ('blog-images', 'blog-images', true,  5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio files: public read" on storage.objects;
create policy "portfolio files: public read" on storage.objects
  for select using (bucket_id in ('site', 'blog-images'));

drop policy if exists "portfolio files: owner insert" on storage.objects;
create policy "portfolio files: owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('site', 'blog-images') and public.is_owner());

drop policy if exists "portfolio files: owner update" on storage.objects;
create policy "portfolio files: owner update" on storage.objects
  for update to authenticated
  using (bucket_id in ('site', 'blog-images') and public.is_owner())
  with check (bucket_id in ('site', 'blog-images') and public.is_owner());

drop policy if exists "portfolio files: owner delete" on storage.objects;
create policy "portfolio files: owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('site', 'blog-images') and public.is_owner());
