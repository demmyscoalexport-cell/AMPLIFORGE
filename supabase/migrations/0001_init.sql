-- =========================================================================
-- AmpliForge — initial schema
-- Auth: Clerk is the source of truth. user.id is the Clerk user_id (text).
-- User-owned tables: ownership enforced in app code (Server Components +
--   service-role Supabase client). RLS is DENY-BY-DEFAULT so nothing leaks
--   if the anon key is ever used against these tables.
-- Public tables (testimonials, blog, etc.): RLS open for SELECT.
-- =========================================================================

create extension if not exists "pgcrypto";

-- =========================================================================
-- USERS  (synced from Clerk via webhook)
-- =========================================================================
create table if not exists public.users (
  id              text primary key,                   -- Clerk user_id
  email           text not null,
  full_name       text,
  avatar_url      text,
  username        text,
  plan            text not null default 'starter' check (plan in ('starter','pro','agency')),
  credits         int  not null default 5000,
  credits_limit   int  not null default 5000,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists users_email_idx on public.users(email);

-- =========================================================================
-- PROJECTS  (owned by a user)
-- =========================================================================
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references public.users(id) on delete cascade,
  title         text not null,
  source        text not null check (source in ('youtube','podcast','webinar')),
  source_url    text,
  thumbnail     text,                                  -- CSS gradient or image URL
  duration      text,
  channel       text,
  status        text not null default 'draft' check (status in ('done','processing','draft','failed')),
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(user_id, created_at desc);

-- =========================================================================
-- CONTENT ITEMS  (the AI-generated outputs — also powers /library)
-- =========================================================================
create table if not exists public.content_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null references public.users(id) on delete cascade,
  project_id   uuid not null references public.projects(id) on delete cascade,
  type         text not null check (type in ('linkedin','email','thread','caption','hook','summary','carousel')),
  title        text not null,
  body         text not null,
  word_count   int  not null default 0,
  starred      boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists content_items_user_id_idx on public.content_items(user_id);
create index if not exists content_items_project_id_idx on public.content_items(project_id);
create index if not exists content_items_type_idx on public.content_items(user_id, type);

-- =========================================================================
-- ANALYTICS DAILY  (one row per user per date)
-- =========================================================================
create table if not exists public.analytics_daily (
  user_id      text not null references public.users(id) on delete cascade,
  date         date not null,
  total        int  not null default 0,
  linkedin     int  not null default 0,
  email        int  not null default 0,
  threads      int  not null default 0,
  primary key (user_id, date)
);
create index if not exists analytics_daily_date_idx on public.analytics_daily(user_id, date desc);

-- =========================================================================
-- TEMPLATES  (public marketplace + user-created)
-- =========================================================================
create table if not exists public.templates (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text not null,
  category       text not null check (category in ('linkedin','email','thread','caption','hook','summary','carousel')),
  author_name    text not null,
  author_avatar  text not null,        -- 2-char initials or URL
  usage_count    int  not null default 0,
  rating         numeric(2,1) not null default 5.0,
  featured       boolean not null default false,
  preview        text not null,
  is_public      boolean not null default true,
  owner_user_id  text references public.users(id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists templates_public_idx on public.templates(is_public) where is_public = true;
create index if not exists templates_owner_idx on public.templates(owner_user_id);

-- =========================================================================
-- TESTIMONIALS  (public marketing content)
-- =========================================================================
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  handle      text not null,
  platform    text not null check (platform in ('youtube','linkedin','x','podcast')),
  avatar      text not null,           -- 2-char initials
  quote       text not null,
  rating      int  not null default 5,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists testimonials_sort_idx on public.testimonials(sort_order);

-- =========================================================================
-- BLOG POSTS
-- =========================================================================
create table if not exists public.blog_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null,
  body           text,
  category       text not null,
  read_time      text not null,
  author         text not null,
  author_avatar  text not null,
  cover          text not null,         -- CSS gradient
  published_at   date not null,
  created_at     timestamptz not null default now()
);
create index if not exists blog_posts_published_idx on public.blog_posts(published_at desc);

-- =========================================================================
-- JOBS  (careers page)
-- =========================================================================
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  department  text not null check (department in ('Engineering','Design','Marketing','Customer Success')),
  location    text not null,
  job_type    text not null check (job_type in ('Full-time','Part-time','Contract')),
  is_open     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- =========================================================================
-- TEAM MEMBERS  (about page)
-- =========================================================================
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  avatar      text not null,
  linkedin    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists team_members_sort_idx on public.team_members(sort_order);

-- =========================================================================
-- CHANGELOG  (releases)
-- =========================================================================
create table if not exists public.changelog_entries (
  id          uuid primary key default gen_random_uuid(),
  version     text not null unique,
  release_date date not null,
  headline    text not null,
  changes     jsonb not null default '[]'::jsonb,    -- [{tag:'new'|'improved'|'fixed', text:'...'}]
  created_at  timestamptz not null default now()
);
create index if not exists changelog_release_idx on public.changelog_entries(release_date desc);

-- =========================================================================
-- updated_at trigger helper
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
--   - User-owned tables: RLS enabled, NO policies = deny everything to
--     anon/authenticated. The service_role key (server-only) bypasses RLS.
--   - Public tables: RLS enabled with public-read policies.
-- =========================================================================
alter table public.users             enable row level security;
alter table public.projects          enable row level security;
alter table public.content_items     enable row level security;
alter table public.analytics_daily   enable row level security;
alter table public.templates         enable row level security;
alter table public.testimonials      enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.jobs              enable row level security;
alter table public.team_members      enable row level security;
alter table public.changelog_entries enable row level security;

-- Public-read policies
drop policy if exists testimonials_read on public.testimonials;
create policy testimonials_read on public.testimonials for select using (true);

drop policy if exists blog_posts_read on public.blog_posts;
create policy blog_posts_read on public.blog_posts for select using (true);

drop policy if exists jobs_read on public.jobs;
create policy jobs_read on public.jobs for select using (is_open = true);

drop policy if exists team_members_read on public.team_members;
create policy team_members_read on public.team_members for select using (true);

drop policy if exists changelog_read on public.changelog_entries;
create policy changelog_read on public.changelog_entries for select using (true);

drop policy if exists templates_read_public on public.templates;
create policy templates_read_public on public.templates for select using (is_public = true);
