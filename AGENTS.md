<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Ampliforge — AI Agent Context

**Read DEVELOPER.md first.** It contains the full architecture, stack, DB schema, pipeline explanation, and coding conventions. This file adds agent-specific rules on top of that.

## What this app does
YouTube content repurposing SaaS. User pastes a YouTube URL → app transcribes + generates LinkedIn posts, threads, emails, hooks, summaries, carousels, and captions using Claude AI.

## Agent Rules

### Always follow these
1. **Read DEVELOPER.md** before writing any code. It explains the architecture.
2. **Server components by default.** Add `"use client"` only when needed.
3. **Never import `lib/supabase/admin.ts` in client components.** It holds the service role key and is server-only.
4. **Use `auth()` from `@clerk/nextjs/server`** in server components/API routes. Use `useAuth()` from `@clerk/nextjs` in client components.
5. **CSS variables, not hex.** Use `var(--brand-blue)`, `var(--text-muted)`, etc. from `app/globals.css`.
6. **`cn()` for classNames.** Always import from `@/lib/utils`.
7. **No new dependencies without checking** if an existing one covers the need (Radix UI, Framer Motion, Zustand, Recharts, TanStack Query are all installed).
8. **Types first.** If you add a DB table or column, update `lib/supabase/types.ts`.

### Data fetching pattern
```ts
// Server component data fetch — always in lib/data/
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getMyData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("table").select("*").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}
```

### API route pattern
```ts
// app/api/v1/something/route.ts
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await requireUserId();
  const supabase = createSupabaseAdminClient();
  // ... fetch and return
  return NextResponse.json({ data });
}
```

### Build Phase Reference
See `DEVELOPER.md` → **Build Phases** for what's done vs. pending. Do not rebuild what's already done. Check `lib/data/` before writing new data fetchers — the function you need probably already exists.

### Content types
The 7 content types the app generates: `linkedin`, `email`, `thread`, `hook`, `summary`, `carousel`, `caption`. All defined in `lib/supabase/types.ts` → `ContentType`.

### Processing pipeline
Do not modify `lib/pipeline/process-project.ts` without understanding the full 5-step flow. Each step updates `processing_jobs` table in real-time so the client can poll status. Breaking this breaks the real-time UX.

### Credit system
Credits are deducted in `POST /api/v1/projects` before processing. `CREDITS_PER_PROJECT = 500`. Never skip credit deduction.
