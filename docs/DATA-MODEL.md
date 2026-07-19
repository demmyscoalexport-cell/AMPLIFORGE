# Data Model Evolution

Additive migrations only. Update `lib/supabase/types.ts` with every change.

---

## Live tables (keep)

`users`, `projects`, `content_items`, `project_transcripts`, `processing_jobs`, `analytics_daily`, `templates`, `testimonials`, `blog_posts`, `jobs`, `team_members`, `changelog_entries`

### Immediate fix (E3)

```sql
alter table content_items add column if not exists updated_at timestamptz default now();
```

Optional: `variant text`, `metadata jsonb` on `content_items`.

---

## P0–P1 — Insights

```sql
create table project_insights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  topics jsonb not null default '[]',
  frameworks jsonb not null default '[]',
  quotes jsonb not null default '[]',
  stats jsonb not null default '[]',
  hooks jsonb not null default '[]',
  raw jsonb not null default '{}',
  created_at timestamptz default now()
);
```

RLS: deny-by-default; service role via admin client (same pattern as transcripts).

---

## E3/P3 — Brands

```sql
create table brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  org_id text, -- null = personal; set when teams ship
  name text not null,
  is_default boolean default false,
  identity jsonb not null default '{}', -- BrandIdentity
  voice jsonb not null default '{}',    -- tone, patterns
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## P3 — Visuals

```sql
create table visual_assets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  template_key text not null,
  width int not null,
  height int not null,
  storage_path text not null,
  public_url text,
  meta jsonb default '{}',
  created_at timestamptz default now()
);
```

Supabase Storage bucket: `visuals` (private + signed URLs).

---

## E3 — Activity + teams

```sql
create table activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  org_id text,
  type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz default now()
);

-- teams: prefer Clerk Organizations; mirror membership in
create table org_members (
  org_id text not null,
  user_id text not null references users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member','viewer')),
  primary key (org_id, user_id)
);
```

---

## P6 — Calendar

```sql
create table calendar_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  content_item_id uuid not null references content_items(id) on delete cascade,
  platform text not null,
  scheduled_at timestamptz not null,
  status text not null default 'planned',
  created_at timestamptz default now()
);
```

---

## P7 — Performance

```sql
create table content_performance (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  impressions int,
  engagements int,
  extras jsonb default '{}',
  source text not null default 'manual', -- manual | csv | api
  recorded_at timestamptz default now()
);
```

---

## Naming note

Product “content package” ≡ existing `projects` row + children. No rename required for v1 APIs.
