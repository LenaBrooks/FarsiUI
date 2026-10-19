/**
 * Best-effort per-IP limit for POST /api/contact.
 * In-memory (per server instance) — enough to blunt spam without new infra.
 */

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

type Bucket = { timestamps: number[] }

const buckets = new Map<string, Bucket>()

function prune(timestamps: number[], now: number) {
  const cutoff = now - WINDOW_MS
  let i = 0
  while (i < timestamps.length && timestamps[i]! < cutoff) i++
  if (i > 0) timestamps.splice(0, i)
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp
  return "unknown"
}

export function checkContactRateLimit(ip: string): {
  ok: boolean
  retryAfterSec?: number
} {
  const now = Date.now()
  let bucket = buckets.get(ip)
  if (!bucket) {
    bucket = { timestamps: [] }
    buckets.set(ip, bucket)
  }

  prune(bucket.timestamps, now)

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0]!
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + WINDOW_MS - now) / 1000)
    )
    return { ok: false, retryAfterSec }
  }

  bucket.timestamps.push(now)
  return { ok: true }
}
