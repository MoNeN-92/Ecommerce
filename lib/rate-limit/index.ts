const WINDOW_MS = 60_000;

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function getClientIp(headerValue: string | null | undefined) {
  return headerValue?.split(",")[0]?.trim() || "local";
}

export function rateLimit(key: string, limit: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }

  current.count += 1;
  return { success: true, remaining: limit - current.count };
}
