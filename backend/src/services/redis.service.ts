import { RedisConfig } from "@config/redis.config";

export class RedisService {
    /**
     * Store a value in Redis with type safety
     *  @Params: key:string
     *  @Params: T:Generic
     */
    public static async setValue<T>(
        key: string,
        value: T,
        ttlSeconds?: number,
    ): Promise<"OK" | null> {
        const redis = await RedisConfig.getInstance();
        if (ttlSeconds) {
            return await redis.set(
                key,
                JSON.stringify(value),
                "EX",
                ttlSeconds,
            );
        }
        return await redis.set(key, JSON.stringify(value));
    }

    /**
     * Get a value from Redis with type safety
     * @Params: key:string
     */
    public static async getValue<T>(key: string): Promise<T | null> {
        const redis = await RedisConfig.getInstance();
        const result = await redis.get(key);
        return result ? (JSON.parse(result) as T) : null;
    }

    /**
     * Delete a key from Redis
     * @Params: key:string
     */
    public static async deleteKey(key: string): Promise<number> {
        const redis = await RedisConfig.getInstance();
        return await redis.del(key);
    }

    // -----------------------------
    // HASH HELPERS
    // -----------------------------

    /**
     * Set a field in a Redis hash with type safety
     * @Params: key:string (hash key)
     * @Params: field:string (hash field)
     * @Params: value:T (generic value)
     */
    public static async hSetValue<T>(
        key: string,
        field: string,
        value: T,
    ): Promise<number> {
        const redis = await RedisConfig.getInstance();
        return await redis.hset(key, field, JSON.stringify(value));
    }

    /**
     * Get a field from a Redis hash with type safety
     * @Params: key:string (hash key)
     * @Params: field:string (hash field)
     */
    public static async hGetValue<T>(
        key: string,
        field: string,
    ): Promise<T | null> {
        const redis = await RedisConfig.getInstance();
        const result = await redis.hget(key, field);
        return result ? (JSON.parse(result) as T) : null;
    }

    /**
     * Get all fields from a Redis hash with type safety
     * @Params: key:string (hash key)
     */
    public static async hGetAllValues<T>(
        key: string,
    ): Promise<Record<string, T>> {
        const redis = await RedisConfig.getInstance();
        const result = await redis.hgetall(key);

        // Convert all JSON strings to T
        const parsed: Record<string, T> = {};
        for (const [field, value] of Object.entries(result)) {
            parsed[field] = JSON.parse(value) as T;
        }
        return parsed;
    }

    /**
     * Delete a field from a Redis hash
     * @Params: key:string (hash key)
     * @Params: field:string (hash field)
     */
    public static async hDeleteField(
        key: string,
        field: string,
    ): Promise<number> {
        const redis = await RedisConfig.getInstance();
        return await redis.hdel(key, field);
    }
}
