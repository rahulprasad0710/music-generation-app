import { RedisConfig } from "@config/redis.config";
import { RATE_LIMIT_CONSTANT } from "@/constants/rateLimit.constant";

export type RateLimitTier = "FREE" | "PAID";

export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetInSeconds: number;
    retryAfterSeconds?: number;
}

export class RateLimitService {
    private static buildKey(userId: number, tier: RateLimitTier): string {
        return `${RATE_LIMIT_CONSTANT.REDIS_KEY_PREFIX}:${tier}:${userId}`;
    }

    public static async checkLimit(
        userId: number,
        isPremium: boolean,
    ): Promise<RateLimitResult> {
        const tier: RateLimitTier = isPremium ? "PAID" : "FREE";
        const config = RATE_LIMIT_CONSTANT[tier];
        const key = this.buildKey(userId, tier);

        const redis = await RedisConfig.getInstance();

        const currentCount = await redis.incr(key);

        if (currentCount === 1) {
            await redis.expire(key, config.WINDOW_SECONDS);
        }

        const ttl = await redis.ttl(key);
        const resetInSeconds = ttl > 0 ? ttl : config.WINDOW_SECONDS;

        const allowed = currentCount <= config.MAX_REQUESTS;
        const remaining = Math.max(0, config.MAX_REQUESTS - currentCount);

        return {
            allowed,
            limit: config.MAX_REQUESTS,
            remaining,
            resetInSeconds,
            ...(!allowed && { retryAfterSeconds: resetInSeconds }),
        };
    }

    public static async resetLimit(
        userId: number,
        isPremium: boolean,
    ): Promise<void> {
        const tier: RateLimitTier = isPremium ? "PAID" : "FREE";
        const key = this.buildKey(userId, tier);
        const redis = await RedisConfig.getInstance();
        await redis.del(key);
    }
}
