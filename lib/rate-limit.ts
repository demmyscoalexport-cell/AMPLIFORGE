import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// 60 requests per minute for general API routes
let generalLimiter: Ratelimit | null = null;
// 10 requests per minute for heavy AI routes (process, regenerate)
let aiLimiter: Ratelimit | null = null;

function getGeneralLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!generalLimiter) {
    generalLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "ampliforge:api",
    });
  }
  return generalLimiter;
}

function getAiLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!aiLimiter) {
    aiLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "ampliforge:ai",
    });
  }
  return aiLimiter;
}

export type RateLimitTier = "general" | "ai";

export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "general"
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = tier === "ai" ? getAiLimiter() : getGeneralLimiter();

  // If Redis is not configured, allow all requests (graceful degradation)
  if (!limiter) {
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
