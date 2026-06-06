-- =========================================================================
-- AmpliForge — processing jobs + project transcripts
-- =========================================================================

create table if not exists public.project_transcripts (
  project_id   uuid primary key references public.projects(id) on delete cascade,
  segments     jsonb not null default '[]'::jsonb,
  full_text    text not null default '',
  created_at   timestamptz not null default now()
);

create table if not exists public.processing_jobs (
  project_id    uuid primary key references public.projects(id) on delete cascade,
  current_step  text not null default 'fetch',
  steps         jsonb not null default '[]'::jsonb,
  error_message text,
  eta_seconds   int not null default 60,
  updated_at    timestamptz not null default now()
);

create index if not exists processing_jobs_updated_idx
  on public.processing_jobs(updated_at desc);

alter table public.project_transcripts enable row level security;
alter table public.processing_jobs enable row level security;
