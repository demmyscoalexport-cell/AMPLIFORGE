// =========================================================================
// Static / demo data that doesn't (yet) live in Supabase.
//
// What MOVED to the database (see lib/data/* + supabase/migrations/0001_init.sql):
//   - projects, content_items, templates, testimonials,
//     blog_posts, jobs, team_members, changelog_entries, analytics_daily, users
//
// What's still here:
//   - PRICING_TIERS         : static product config (not a DB concern)
//   - MOCK_TRUST_LOGOS      : marketing copy on landing page
//   - MOCK_ACTIVITY         : activity feed (deferred entity)
//   - MOCK_NOTIFICATIONS    : notification bell (deferred entity)
//   - MOCK_TRANSCRIPT       : per-project transcript (schema TBD)
// =========================================================================
import type {
  ActivityItem,
  NotificationItem,
  PricingTier,
} from "@/types";

// ===== Pricing (static product config) ==================================
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 29, yearly: 19 },
    description: "For solo creators just getting started.",
    highlight: false,
    features: [
      "10 videos / month",
      "5 content formats",
      "Standard AI model",
      "Email support",
      "1 brand voice",
    ],
    cta: "Get Started",
    ctaHref: "/sign-up",
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 79, yearly: 49 },
    description: "For serious creators scaling output.",
    highlight: true,
    features: [
      "50 videos / month",
      "All content formats",
      "Priority AI model",
      "Custom brand voice",
      "Analytics dashboard",
      "Priority support",
      "Template marketplace access",
    ],
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
  },
  {
    id: "agency",
    name: "Agency",
    price: { monthly: 199, yearly: 129 },
    description: "For teams managing multiple creators.",
    highlight: false,
    features: [
      "Unlimited videos",
      "White-label exports",
      "10 team seats",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SOC2 compliance package",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

// ===== Landing trust bar (marketing copy) ===============================
export const MOCK_TRUST_LOGOS = [
  "YouTube Creator", "Mr. Beast Co", "Lex Fridman", "All-In Pod",
  "Modern Wisdom", "My First Million", "Acquired", "Indie Hackers",
  "Y Combinator", "Tim Ferriss", "Justin Welsh", "Codie Sanchez",
];

// ===== Activity feed (deferred — TODO: move to DB) ======================
export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a_001", icon: "sparkles", label: "Email sequence generated",       meta: "5 emails · Agency Building",       createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  { id: "a_002", icon: "copy",     label: "LinkedIn post exported to clipboard", meta: "Viral hook · 320 chars",      createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
  { id: "a_003", icon: "bookmark", label: "New template saved",             meta: "Product Launch · LinkedIn",       createdAt: new Date(Date.now() - 1000 * 60 * 47).toISOString() },
  { id: "a_004", icon: "share",    label: "Twitter thread published",       meta: "8-tweet thread · 1.2k impressions", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "a_005", icon: "video",    label: "New video processed",            meta: "Creator Economy Podcast · 1h 24m", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "a_006", icon: "edit",     label: "Edited LinkedIn post",           meta: "Tone: more conversational",       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "a_007", icon: "download", label: "Bulk export — 12 assets",        meta: "Webinar replay assets",           createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

// ===== Notifications (deferred — TODO: move to DB) ======================
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n_001", title: "Processing complete", body: "'The Future of Creator Economy' generated 6 outputs.",          createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),       read: false, tone: "success" },
  { id: "n_002", title: "Credits low",          body: "You've used 80% of your monthly credits. Upgrade to Pro for unlimited.", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),  read: false, tone: "warning" },
  { id: "n_003", title: "New template featured", body: "Your template 'Viral Hook Generator' is now Editor's Pick.",  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),  read: false, tone: "info" },
  { id: "n_004", title: "Weekly digest ready", body: "Your 12-piece content recap for last week is ready to review.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true,  tone: "info" },
  { id: "n_005", title: "Product update — v2.4", body: "New: Carousel exports for LinkedIn. Improved: 40% faster transcription.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), read: true, tone: "info" },
];

// ===== Project transcript (deferred — TODO: real schema) ================
export const MOCK_TRANSCRIPT = [
  { time: "0:00", text: "So I want to start with a question that nobody is asking, which is: why do most agencies fail in the first 90 days?" },
  { time: "0:14", text: "And I think the answer is uncomfortable. It's not because the work is hard. It's because the founder is afraid to charge what the work is worth." },
  { time: "0:42", text: "I'll give you a concrete example. When I started my first agency, I was charging $1,500 a month for what I now charge $9,000 a month for. Same deliverables. Same team. Same outcomes." },
  { time: "1:18", text: "The only thing that changed was my willingness to walk away from clients who wouldn't pay the new number." },
  { time: "1:46", text: "There's a framework I use now called the 'three-yes test.' Before I send a proposal, I ask myself three questions: Do I want this client? Do I believe I can over-deliver? And — this is the important one — am I genuinely indifferent to whether they say yes?" },
  { time: "2:32", text: "If the answer to all three is yes, I send the proposal at 2x what feels comfortable. Roughly 60% of the time, they say yes." },
  { time: "3:01", text: "The 40% who say no? Those were never your clients to begin with. They were going to drain you, ask for endless revisions, and eventually leave anyway." },
  { time: "3:38", text: "So that's the first principle. Charge for the outcome, not the labor. The second principle is even more counterintuitive — pick a niche that scares you." },
];
