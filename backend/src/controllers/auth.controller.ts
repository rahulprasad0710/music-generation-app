// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import authService from "../services/auth.service";

export class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const response = await authService.registerWithCredentials({
            name,
            email,
            password,
        });

        res.json({
            message: "registered successfully",
            data: response,
            success: true,
        });
    }

    async login(req: Request, res: Response) {
        const payload = req.body;

        const { email, password, isRememberMe } = payload;

        const { refreshToken, ...rest } =
            await authService.loginWithCredentials({
                email,
                password,
                isRememberMe,
            });

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: isRememberMe
                ? 30 * 24 * 60 * 60 * 1000 // 30 days
                : 60 * 60 * 1000, //1 hr
        })
            .status(200)
            .json({
                success: true,
                data: rest,
                message: "login successful",
            });
    }

    async authenticateUser(req: Request, res: Response) {
        const { verifiedUserId, verifiedUser } = req;
        const accessToken = await authService.authenticateMe(verifiedUserId);
        const { refreshToken, ...restVerifiedUserData } = verifiedUser;

        res.status(200).json({
            success: true,
            data: {
                ...restVerifiedUserData,
                accessToken,
            },
            message: "User authenticated successfully",
        });
    }

    async logout(req: Request, res: Response) {
        const { verifiedUserId } = req;
        const response = await authService.logout(verifiedUserId);
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        })
            .status(200)
            .json({
                success: true,
                data: response,
                message: "logout successful",
            });
    }

    async refreshUser(req: Request, res: Response) {
        const { verifiedUserId, verifiedUser } = req;

        const isRememberMe = verifiedUser?.isRememberMe;

        const { refreshToken, accessToken } = await authService.refreshUser(
            verifiedUserId,
            isRememberMe,
        );

        const isProduction = process.env.NODE_ENV === "production";

        const { refreshToken: _, ...restVerifiedUser } = verifiedUser;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: isRememberMe
                ? 30 * 24 * 60 * 60 * 1000 // 30 days
                : 60 * 60 * 1000, //1 hr
        })
            .status(200)
            .json({
                success: true,
                data: {
                    ...restVerifiedUser,
                    accessToken,
                },
                message: "refresh token successful.",
            });
    }
}
