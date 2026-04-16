import express from "express";
import { rateLimitMiddleware } from "@/middlewares/ratelimit.middleware";
import verifyToken from "@/middlewares/authentication.middleware";

const router = express.Router();

// Apply globally after auth — every protected route respects rate limits
router.use(verifyToken);
router.use(rateLimitMiddleware);

router.get("/some-resource", (req, res) => {
    res.json({ success: true, data: "your data here" });
});

export default router;

// ─── OR apply to specific routes only ────────────────────────────────────────

const singleRouter = express.Router();

singleRouter.get(
    "/heavy-endpoint",
    verifyToken,
    rateLimitMiddleware,
    (req, res) => {
        res.json({ success: true });
    },
);
