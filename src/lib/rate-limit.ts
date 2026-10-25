// Fixed-window limiter per key (client IP), for the assistant and the lesson
// request forms. In memory: on Vercel Fluid Compute
// an instance is reused across requests, so this throttles bursts, but it is
// per instance and resets on cold start — a cost guard, not a hard quota.

type Bucket = { count: number; resetAt: number };

export function createRateLimiter(limit: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return function hit(key: string, now = Date.now()): { ok: boolean; retryAfterS: number } {
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, retryAfterS: 0 };
    }
    bucket.count += 1;
    if (bucket.count > limit) return { ok: false, retryAfterS: Math.ceil((bucket.resetAt - now) / 1000) };
    return { ok: true, retryAfterS: 0 };
  };
}
