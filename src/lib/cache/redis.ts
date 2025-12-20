import Redis from "ioredis"

/* eslint-disable no-restricted-properties */
const redis = new Redis(process.env["REDIS_URL"] ?? "redis://localhost:6379")
/* eslint-enable no-restricted-properties */

redis.on("error", (error) => {
  console.error("Redis connection error:", error)
})

export { redis }

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  if (!cached) return null
  return JSON.parse(cached) as T
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<void> {
  const serialized = JSON.stringify(value)
  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, serialized)
  } else {
    await redis.set(key, serialized)
  }
}

export async function deleteCached(key: string): Promise<void> {
  await redis.del(key)
}

export async function invalidatePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
