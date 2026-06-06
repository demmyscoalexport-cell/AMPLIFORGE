-- =========================================================================
-- AmpliForge — seed public/marketing content.
-- Idempotent: uses ON CONFLICT or guards so re-running is safe.
-- Run AFTER 0001_init.sql.
-- =========================================================================

-- =========================================================================
-- TESTIMONIALS
-- =========================================================================
delete from public.testimonials;
insert into public.testimonials (name, handle, platform, avatar, quote, rating, sort_order) values
('Sarah Chen',  '@sarahbuilds', 'linkedin', 'SC', 'AmpliForge gave me my Sundays back. I used to spend 6 hours repurposing one podcast. Now it takes 6 minutes.', 5, 1),
('Marcus Webb', '@marcusgrows', 'youtube',  'MW', 'Tripled my LinkedIn engagement in 30 days. The hooks AmpliForge generates are honestly better than mine.',   5, 2),
('Lara Acosta', '@laraacosta',  'linkedin', 'LA', 'This is the only AI tool I trust to keep my voice intact. It feels like a co-writer, not a content factory.',     5, 3),
('David Park',  '@dpark',       'x',        'DP', 'Went from 0 to 27k followers in 4 months using AmpliForge to repurpose my YouTube into Twitter threads.',         5, 4),
('Priya Patel', 'Founder Files Podcast', 'podcast', 'PP', 'My show notes used to take a full day. AmpliForge gives me summaries, social posts, and email copy in one click.', 5, 5),
('Tom Reilly',  '@tomreillyco', 'linkedin', 'TR', 'I run a 14-person agency. AmpliForge replaced two full-time content roles. Pays for itself 100x over.',          5, 6);

-- =========================================================================
-- TEAM MEMBERS
-- =========================================================================
delete from public.team_members;
insert into public.team_members (name, role, avatar, linkedin, sort_order) values
('Ava Romero',    'CEO & Co-founder',     'AR', '#', 1),
('Kenji Okafor',  'CTO & Co-founder',     'KO', '#', 2),
('Priya Patel',   'Head of Design',       'PP', '#', 3),
('Jonas Müller',  'Head of AI',           'JM', '#', 4),
('Sofia Reyes',   'Head of Growth',       'SR', '#', 5),
('Daniel Kim',    'Head of Engineering',  'DK', '#', 6);

-- =========================================================================
-- BLOG POSTS
-- =========================================================================
delete from public.blog_posts;
insert into public.blog_posts (slug, title, excerpt, category, read_time, author, author_avatar, cover, published_at) values
('creator-economy-2026',
 'The Creator Economy in 2026 — Where Real Money Will Be Made',
 'Forget audience size. The next era of the creator economy will be won by depth, trust, and infrastructure.',
 'Industry', '8 min', 'Ava Romero', 'AR',
 'linear-gradient(135deg, #0D66D0, #9256D9)', '2026-05-12'),
('voice-of-ai',
 'Keeping Your Voice in an Age of AI Content',
 'How to use AI without sounding like everyone else. A practical framework for voice preservation.',
 'Craft', '6 min', 'Priya Patel', 'PP',
 'linear-gradient(135deg, #E34850, #FF6B6B)', '2026-05-04'),
('repurposing-funnel',
 'The Repurposing Funnel — One Video, 14 Touchpoints',
 'A visual breakdown of how one 30-min interview becomes a full week of content across 7 platforms.',
 'Strategy', '12 min', 'Sofia Reyes', 'SR',
 'linear-gradient(135deg, #D4AF37, #FFD700)', '2026-04-21'),
('ai-tools-creator-stack',
 'The 2026 Creator Stack — Tools We Actually Use',
 'We surveyed 1,200 creators making over $100k/yr. Here''s their full toolkit, ranked by ROI.',
 'Tools', '10 min', 'Kenji Okafor', 'KO',
 'linear-gradient(135deg, #9256D9, #0D66D0)', '2026-04-12'),
('linkedin-algorithm',
 'Inside the LinkedIn Algorithm — What Changed in 2026',
 'A reverse-engineered look at the engagement signals LinkedIn is rewarding (and punishing) this year.',
 'Platforms', '9 min', 'Jonas Müller', 'JM',
 'linear-gradient(135deg, #10B981, #0D66D0)', '2026-03-28'),
('writing-with-ai',
 'Writing With AI, Not Through It',
 'The mental model shift that separates creators who feel AI is cheating from those who use it as leverage.',
 'Craft', '7 min', 'Ava Romero', 'AR',
 'linear-gradient(135deg, #F59E0B, #E34850)', '2026-03-15');

-- =========================================================================
-- JOBS
-- =========================================================================
delete from public.jobs;
insert into public.jobs (title, department, location, job_type) values
('Senior Full-Stack Engineer', 'Engineering',       'Remote · Global',   'Full-time'),
('Staff ML Engineer',          'Engineering',       'Remote · Americas', 'Full-time'),
('Senior Product Designer',    'Design',            'Remote · Europe',   'Full-time'),
('Brand Designer',             'Design',            'Remote · Global',   'Full-time'),
('Head of Content',            'Marketing',         'Remote · Americas', 'Full-time'),
('Lifecycle Marketing Manager','Marketing',         'Remote · Global',   'Full-time'),
('Customer Success Lead',      'Customer Success',  'Remote · Global',   'Full-time'),
('Technical Writer',           'Marketing',         'Remote · Global',   'Contract');

-- =========================================================================
-- CHANGELOG
-- =========================================================================
delete from public.changelog_entries;
insert into public.changelog_entries (version, release_date, headline, changes) values
('2.4.0', '2026-05-18', 'Carousel exports + faster transcription',
 '[
    {"tag":"new","text":"LinkedIn carousel generator with 6 layout presets"},
    {"tag":"new","text":"Bulk-export to Notion, Google Docs, and Buffer"},
    {"tag":"improved","text":"Transcription is now 40% faster on long-form video"},
    {"tag":"fixed","text":"Rare bug where Twitter thread numbering would restart"}
  ]'::jsonb),
('2.3.0', '2026-04-22', 'Custom brand voice + team workspaces',
 '[
    {"tag":"new","text":"Train AmpliForge on your past content to lock in voice"},
    {"tag":"new","text":"Shared workspaces for Agency plan customers"},
    {"tag":"improved","text":"Editor now supports markdown shortcuts"}
  ]'::jsonb),
('2.2.0', '2026-03-30', 'Analytics dashboard + Pro plan',
 '[
    {"tag":"new","text":"Full analytics suite with 12 reports"},
    {"tag":"new","text":"Pro plan — 50 videos/mo, priority queue"},
    {"tag":"fixed","text":"Sidebar collapse state now persists across sessions"}
  ]'::jsonb),
('2.1.0', '2026-02-12', 'Template marketplace beta',
 '[
    {"tag":"new","text":"Browse and remix templates from top creators"},
    {"tag":"improved","text":"AI hooks are 2x more likely to be saved (internal A/B)"}
  ]'::jsonb);

-- =========================================================================
-- TEMPLATES (public marketplace)
-- =========================================================================
delete from public.templates where is_public = true and owner_user_id is null;
insert into public.templates (name, description, category, author_name, author_avatar, usage_count, rating, featured, preview, is_public) values
('Viral LinkedIn Hook Generator',
 'Transform any insight into a scroll-stopping LinkedIn opener that hooks within 3 seconds.',
 'hook', 'Justin Welsh', 'JW', 4820, 4.9, true,
 'I made $1M last year. Here''s exactly what I''d do differently…', true),
('5-Email Welcome Sequence',
 'Convert subscribers to fans with a battle-tested 5-day onboarding flow.',
 'email', 'Dickie Bush', 'DB', 3210, 4.8, true,
 'Welcome aboard. Before we get started, I want to tell you a story…', true),
('Twitter Thread: Lessons Format',
 'The classic ''10 lessons from X'' thread structure, optimized for saves and reshares.',
 'thread', 'Sahil Bloom', 'SB', 6740, 4.9, true,
 '10 lessons from 10 years of building businesses 🧵', true),
('LinkedIn Carousel: 5-Slide Story',
 'A narrative arc that walks readers through a complete idea in 5 slides.',
 'carousel', 'Amelia Sordell', 'AS', 2890, 4.7, false,
 'Slide 1: The Setup\nSlide 2: The Conflict\nSlide 3: The Realization…', true),
('Founder Story Caption',
 'A tight, emotional caption format perfect for Instagram or LinkedIn.',
 'caption', 'Codie Sanchez', 'CS', 1980, 4.8, false,
 '3 years ago, I was broke and burnt out. Today…', true),
('Cold Outreach Email',
 'Personalized cold email framework with 23% reply rate.',
 'email', 'Alex Hormozi', 'AH', 5410, 4.9, false,
 'Hey {{firstName}}, noticed you launched {{product}} last week…', true),
('Podcast Episode Summary',
 'Bullet-pointed recap optimized for show notes and SEO.',
 'summary', 'Lex Fridman', 'LF', 1240, 4.6, false,
 'In this episode, we cover: (1) the future of AI, (2)…', true),
('LinkedIn Authority Post',
 'Position yourself as the go-to expert with this 6-paragraph structure.',
 'linkedin', 'Lara Acosta', 'LA', 3680, 4.8, false,
 'After 8 years in B2B marketing, here''s what nobody tells you…', true),
('Hook: Bold Contrarian Claim',
 'Open with a controversial position that demands a response.',
 'hook', 'Naval Ravikant', 'NR', 4120, 4.7, false,
 'Hard work is overrated. Here''s why…', true),
('Long-form Thread: Case Study',
 'Walk readers through a real case study with stakes, pivots, and outcomes.',
 'thread', 'Greg Isenberg', 'GI', 2210, 4.8, false,
 'I sold a SaaS for $4.2M last month. Here''s how it happened 🧵', true),
('Email Re-engagement Win-back',
 'Bring dormant subscribers back to life with this 3-email sequence.',
 'email', 'Jay Clouse', 'JC', 1450, 4.6, false,
 'Hey {{firstName}}, I noticed it''s been a while…', true),
('Instagram Reel Caption',
 'Punchy 2-line caption format that drives saves on short-form.',
 'caption', 'Brett Williams', 'BW', 980, 4.5, false,
 'Stop scrolling. Read this twice. It will change your week.', true);
