import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "@utils/asyncTryCatchFn";
import { AuthController } from "@controllers/auth.controller";
import { loginSchema, registerSchema } from "@/validations/auth.validation";
import requestValidator from "@/middlewares/requestValidator";
import verifyToken, {
    verifyRefreshToken,
} from "@/middlewares/authentication.middleware";

const authController = new AuthController();

const router = ExpressRouter();

// router.use(verifyToken);

router.post(
    "/register",
    requestValidator(registerSchema),
    asyncTryCatchFn(authController.register),
);
router.post(
    "/login",
    requestValidator(loginSchema),
    asyncTryCatchFn(authController.login),
);
router.get(
    "/me",
    verifyRefreshToken,
    asyncTryCatchFn(authController.authenticateUser),
);
router.get("/logout", verifyToken, asyncTryCatchFn(authController.logout));
router.post(
    "/refresh-token",
    verifyRefreshToken,
    asyncTryCatchFn(authController.refreshUser),
);

export default router;
