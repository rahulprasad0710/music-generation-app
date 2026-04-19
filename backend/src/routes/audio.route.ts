import { Router, Request, Response, NextFunction } from "express";
import { rateLimitMiddleware } from "@/middlewares/ratelimit.middleware";
import verifyToken from "@/middlewares/authentication.middleware";
import asyncTryCatchFn from "@utils/asyncTryCatchFn";
import { AudioController } from "@controllers/audio.controller";

const router = Router();

const audioController = new AudioController();

router.get(
    "/users",
    verifyToken,
    asyncTryCatchFn(audioController.getAudioByUser),
);
router.get("/", asyncTryCatchFn(audioController.getAll));

export default router;
