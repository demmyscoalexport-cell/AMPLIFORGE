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
export type PlanTier = "starter" | "pro" | "agency";

export interface Project {
  id: string;
  title: string;
  source: SourceType;
  thumbnail: string;
  duration: string;
  channel: string;
  outputsCount: number;
  status: ProjectStatus;
  createdAt: string;
  tags: string[];
}

export interface ContentItem {
  id: string;
  projectId: string;
  type: ContentType;
  title: string;
  body: string;
  wordCount: number;
  createdAt: string;
  starred: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: ContentType;
  authorName: string;
  authorAvatar: string;
  usageCount: number;
  rating: number;
  featured: boolean;
  preview: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  platform: "youtube" | "linkedin" | "x" | "podcast";
  avatar: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  linkedin: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  cover: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
  meta: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  tone: "info" | "success" | "warning";
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: "queued" | "active" | "done";
  progress: number;
}

export interface PricingTier {
  id: PlanTier;
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  highlight: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

export interface AnalyticsPoint {
  date: string;
  total: number;
  linkedin: number;
  email: number;
  threads: number;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  headline: string;
  changes: { tag: "new" | "improved" | "fixed"; text: string }[];
}

export interface JobPosting {
  id: string;
  title: string;
  department: "Engineering" | "Design" | "Marketing" | "Customer Success";
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
}
