export const RATE_LIMIT_CONSTANT = {
    FREE: {
        MAX_REQUESTS: 20,
        WINDOW_SECONDS: 60,
    },
    PAID: {
        MAX_REQUESTS: 100,
        WINDOW_SECONDS: 60,
    },
    REDIS_KEY_PREFIX: "rate_limit",
} as const;
