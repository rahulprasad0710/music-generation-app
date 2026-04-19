import { Request, Response, NextFunction } from "express";
import { ILoggedInUser } from "@/types/auth.types";
import { RateLimitService } from "@/services/rateLimit.service";

/**
 * Express middleware that enforces per-user rate limiting based on tier.
 *
 * Expects `req.user` to be populated by a preceding auth middleware.
 * Attaches standard rate-limit headers to every response.
 *
 * Headers returned:
 *   X-RateLimit-Limit     — max requests allowed in the window
 *   X-RateLimit-Remaining — requests left in the current window
 *   X-RateLimit-Reset     — seconds until the window resets
 *   Retry-After           — seconds to wait before retrying (only on 429)
 */
export async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.log("TTT");
    const user = req.verifiedUser as ILoggedInUser | undefined;

    // If no authenticated user, skip rate limiting (let auth middleware handle it)
    if (!user || !user.authenticated || !user.id) {
        next();
        return;
    }

    // Blacklisted users are rejected outright — no quota consumed
    if (user.isBlacklisted) {
        res.status(403).json({
            success: false,
            message: "Your account has been suspended.",
        });
        return;
    }

    try {
        const result = await RateLimitService.checkLimit(
            user.id,
            user.isPremium,
        );

        res.setHeader("X-RateLimit-Limit", result.limit);
        res.setHeader("X-RateLimit-Remaining", result.remaining);
        res.setHeader("X-RateLimit-Reset", result.resetInSeconds);

        if (!result.allowed) {
            res.setHeader(
                "Retry-After",
                result.retryAfterSeconds ?? result.resetInSeconds,
            );
            res.status(429).json({
                success: false,
                message: "Too many requests. Please slow down.",
                retryAfterSeconds: result.retryAfterSeconds,
                tier: user.isPremium ? "PAID" : "FREE",
            });
            return;
        }

        next();
    } catch (error) {
        console.error(
            "[RateLimitMiddleware] Redis error, failing open:",
            error,
        );
        next();
    }
}
