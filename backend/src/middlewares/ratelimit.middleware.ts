import { Request, Response, NextFunction } from "express";
import { ILoggedInUser } from "@/types/auth.types";
import { RateLimitService } from "@/services/rateLimit.service";

export async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.log("TTT");
    const user = req.verifiedUser as ILoggedInUser | undefined;

    if (!user || !user.authenticated || !user.id) {
        next();
        return;
    }

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
