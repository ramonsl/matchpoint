import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Utiliza o Redis em produção, ou um mock simples em dev para evitar quebrar sem ENV
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : ({
      sadd: async () => 1,
      eval: async () => [0],
      set: async () => 'OK',
      get: async () => null,
      incr: async () => 1,
      expire: async () => 1,
      pipeline: () => ({
        incr: () => ({}),
        expire: () => ({}),
        exec: async () => [1, 1],
      }),
    } as unknown as Redis);

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});
