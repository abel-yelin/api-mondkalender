// Simple in-memory cache implementation
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const globalCache = new MemoryCache();

// Cleanup expired entries every hour
setInterval(() => {
  globalCache.cleanup();
}, 3600 * 1000);

// Generate cache key for moon data
export function generateMoonCacheKey(
  date: Date,
  latitude?: number,
  longitude?: number
): string {
  const dateKey = date.toISOString().split('T')[0];
  if (latitude !== undefined && longitude !== undefined) {
    // Round coordinates to 2 decimal places for better cache hit rate
    const latKey = latitude.toFixed(2);
    const lonKey = longitude.toFixed(2);
    return `moon:${dateKey}:${latKey}:${lonKey}`;
  }
  return `moon:${dateKey}`;
}

// Get cached data or fetch fresh data
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = globalCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  globalCache.set(key, data, ttlSeconds);

  return data;
}

// Export cache instance for direct access if needed
export { globalCache };
