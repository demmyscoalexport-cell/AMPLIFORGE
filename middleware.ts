import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/library(.*)",
  "/templates(.*)",
  "/analytics(.*)",
  "/settings(.*)",
  "/upgrade(.*)",
]);

// Heavy AI routes get a tighter limit
const isAiRoute = createRouteMatcher([
  "/api/v1/projects/:id/process(.*)",
  "/api/v1/projects/:id/content/:contentId/regenerate(.*)",
]);

const isApiV1Route = createRouteMatcher(["/api/v1/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Rate limiting for all /api/v1/* routes
  if (isApiV1Route(req)) {
    const { userId } = await auth();
    // Use userId if authenticated, otherwise fall back to IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    const identifier = userId ?? ip;
    const tier = isAiRoute(req) ? "ai" : "general";

    const { success, limit, remaining, reset } = await checkRateLimit(identifier, tier);

    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          },
        }
      );
    }
  }

  // Auth guard for dashboard pages
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
