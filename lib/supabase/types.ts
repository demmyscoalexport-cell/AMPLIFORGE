// Hand-rolled DB types matching supabase/migrations/0001_init.sql.
// If you change the schema, update this file (or generate via `supabase gen types`).

export type PlanTier = "starter" | "pro" | "agency";
export type SourceType = "youtube" | "podcast" | "webinar";
export type ProjectStatus = "done" | "processing" | "draft" | "failed";
export type ContentType =
  | "linkedin"
  | "email"
  | "thread"
  | "caption"
  | "hook"
  | "summary"
  | "carousel";
export type PlatformType = "youtube" | "linkedin" | "x" | "podcast";
export type Department = "Engineering" | "Design" | "Marketing" | "Customer Success";
export type JobType = "Full-time" | "Part-time" | "Contract";
export type ChangeTag = "new" | "improved" | "fixed";

/** Supabase json/jsonb column type */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  plan: PlanTier;
  credits: number;
  credits_limit: number;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  user_id: string;
  title: string;
  source: SourceType;
  source_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  channel: string | null;
  status: ProjectStatus;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DbContentItem {
  id: string;
  user_id: string;
  project_id: string;
  type: ContentType;
  title: string;
  body: string;
  word_count: number;
  starred: boolean;
  created_at: string;
}

export interface DbAnalyticsDaily {
  user_id: string;
  date: string;
  total: number;
  linkedin: number;
  email: number;
  threads: number;
}

export interface DbTemplate {
  id: string;
  name: string;
  description: string;
  category: ContentType;
  author_name: string;
  author_avatar: string;
  usage_count: number;
  rating: number;
  featured: boolean;
  preview: string;
  is_public: boolean;
  owner_user_id: string | null;
  created_at: string;
}

export interface DbTestimonial {
  id: string;
  name: string;
  handle: string;
  platform: PlatformType;
  avatar: string;
  quote: string;
  rating: number;
  sort_order: number;
  created_at: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  category: string;
  read_time: string;
  author: string;
  author_avatar: string;
  cover: string;
  published_at: string;
  created_at: string;
}

export interface DbJob {
  id: string;
  title: string;
  department: Department;
  location: string;
  job_type: JobType;
  is_open: boolean;
  created_at: string;
}

export interface DbTeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  linkedin: string | null;
  sort_order: number;
  created_at: string;
}

export interface DbChangelogEntry {
  id: string;
  version: string;
  release_date: string;
  headline: string;
  changes: Json;
  created_at: string;
}

export interface TranscriptSegment {
  time: string;
  text: string;
}

export interface ProcessingStepState {
  id: string;
  label: string;
  status: "queued" | "active" | "done";
  progress: number;
}

export interface DbProjectTranscript {
  project_id: string;
  segments: Json;
  full_text: string;
  created_at: string;
}

export interface DbProcessingJob {
  project_id: string;
  current_step: string;
  steps: Json;
  error_message: string | null;
  eta_seconds: number;
  updated_at: string;
}

export interface ProjectTranscriptInsert {
  project_id: string;
  segments?: Json;
  full_text?: string;
  created_at?: string;
}

export interface ProcessingJobInsert {
  project_id: string;
  current_step?: string;
  steps?: Json;
  error_message?: string | null;
  eta_seconds?: number;
  updated_at?: string;
}

// Explicit Insert/Update shapes — supabase-js v2 doesn't infer well from
// Partial<X> & {...} intersections, so we write them out.

export interface UserInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
  plan?: "starter" | "pro" | "agency";
  credits?: number;
  credits_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectInsert {
  id?: string;
  user_id: string;
  title: string;
  source: "youtube" | "podcast" | "webinar";
  source_url?: string | null;
  thumbnail?: string | null;
  duration?: string | null;
  channel?: string | null;
  status?: "done" | "processing" | "draft" | "failed";
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ContentItemInsert {
  id?: string;
  user_id: string;
  project_id: string;
  type: ContentType;
  title: string;
  body: string;
  word_count?: number;
  starred?: boolean;
  created_at?: string;
}

// For the read-only/seeded tables we just expose Row; we never insert from app code.
export interface Database {
  public: {
    Tables: {
      users:             { Row: DbUser;            Insert: UserInsert;        Update: Partial<UserInsert> };
      projects:          { Row: DbProject;         Insert: ProjectInsert;     Update: Partial<ProjectInsert> };
      content_items:     { Row: DbContentItem;     Insert: ContentItemInsert; Update: Partial<ContentItemInsert> };
      analytics_daily:   { Row: DbAnalyticsDaily;  Insert: DbAnalyticsDaily;  Update: Partial<DbAnalyticsDaily> };
      templates:         { Row: DbTemplate;        Insert: DbTemplate;        Update: Partial<DbTemplate> };
      testimonials:      { Row: DbTestimonial;     Insert: DbTestimonial;     Update: Partial<DbTestimonial> };
      blog_posts:        { Row: DbBlogPost;        Insert: DbBlogPost;        Update: Partial<DbBlogPost> };
      jobs:              { Row: DbJob;             Insert: DbJob;             Update: Partial<DbJob> };
      team_members:      { Row: DbTeamMember;      Insert: DbTeamMember;      Update: Partial<DbTeamMember> };
      changelog_entries: { Row: DbChangelogEntry;  Insert: DbChangelogEntry;  Update: Partial<DbChangelogEntry> };
      project_transcripts: { Row: DbProjectTranscript; Insert: ProjectTranscriptInsert; Update: Partial<ProjectTranscriptInsert> };
      processing_jobs:     { Row: DbProcessingJob;     Insert: ProcessingJobInsert;     Update: Partial<ProcessingJobInsert> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
