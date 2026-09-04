import "server-only";

/**
 * Per-IP, per-route submission limiting for the public form endpoints.
 *
 * In-memory on purpose, for launch. It resets on every deploy and each
 * serverless instance keeps its own counters, so a determined abuser spread
 * across instances gets more than the nominal allowance. That is a known
 * limitation, not a bug: it stops the realistic case (someone leaning on a
 * submit button, a naive script hitting one endpoint) at zero infrastructure
 * cost.
 *
 * Upgrade path if abuse becomes real: Upstash Redis (@upstash/ratelimit) gives
 * the same interface backed by shared state across instances. Swap the Map for
 * it and the call sites do not change.
 */

const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** key = `${route}:${ip}` -> timestamps of submissions inside the window */
const hits = new Map<string, number[]>();

/** Drop expired entries so the Map cannot grow without bound. */
function prune(now: number) {
  for (const [key, times] of hits) {
    const live = times.filter((t) => now - t < WINDOW_MS);
    if (live.length === 0) hits.delete(key);
    else hits.set(key, live);
  }
}

let lastPrune = 0;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/**
 * Read the client IP from the proxy headers Vercel sets. Falls back to a
 * constant so a request with no discoverable IP is still limited rather than
 * bypassing the check entirely.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(route: string, ip: string): RateLimitResult {
  const now = Date.now();

  // Cheap amortised cleanup — at most once a minute.
  if (now - lastPrune > 60_000) {
    prune(now);
    lastPrune = now;
  }

  const key = `${route}:${ip}`;
  const times = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (times.length >= MAX_SUBMISSIONS) {
    const oldest = times[0]!;
    const retryAfterSeconds = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    console.warn("[rate-limit] blocked", {
      route,
      ip,
      at: new Date(now).toISOString(),
      submissionsInWindow: times.length,
      retryAfterSeconds,
    });
    hits.set(key, times);
    return { ok: false, retryAfterSeconds };
  }

  times.push(now);
  hits.set(key, times);
  return { ok: true };
}

/** 429 response with a friendly message and a Retry-After header. */
export function rateLimitResponse(retryAfterSeconds: number): Response {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return Response.json(
    {
      ok: false,
      error:
        `You've sent several messages in a short time. Please wait about ${minutes} ` +
        `minute${minutes === 1 ? "" : "s"} and try again — or email us directly if it's urgent.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
