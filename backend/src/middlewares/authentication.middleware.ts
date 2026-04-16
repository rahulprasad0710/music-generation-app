import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError";
import { ErrorType } from "../enums/error.enum";
import { Socket } from "socket.io";
import authService from "@services/auth.service";
import jwt from "jsonwebtoken";
import { APP_CONSTANT } from "@/constants/AppConstant";

// declare module "socket.io" {
//     interface Socket {
//         verifiedUserId?: number;
//     }
// }
const decodeToken = async (
    token: string,
    tokenType?: string,
): Promise<number> => {
    try {
        let decoded = null;
        if (tokenType === "REFRESH") {
            decoded = jwt.verify(
                token,
                APP_CONSTANT.JWT_REFRESH_SECRET as string,
            );
        } else {
            decoded = jwt.verify(
                token,
                APP_CONSTANT.JWT_ACCESS_SECRET as string,
            );
        }

        // Check if token is decoded and has an id
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("id" in decoded)
        ) {
            throw new AppError("Invalid token payload", ErrorType.AUTH_ERROR);
        }

        return Number(decoded.id);
    } catch (error: unknown) {
        console.log("LOG: ~ decodeToken ~ error:", error);
        if (typeof error === "object" && error !== null && "name" in error) {
            const name = (error as { name: string }).name;

            if (name === "TokenExpiredError") {
                throw new AppError(
                    "Token has expired",
                    ErrorType.EXPIRED_TOKEN_ERROR,
                );
            }

            if (name === "JsonWebTokenError") {
                throw new AppError("Invalid token", ErrorType.AUTH_ERROR);
            }
        }

        throw new AppError("Authentication failed", ErrorType.AUTH_ERROR);
    }
};
const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        // const refreshToken = req.cookies.refreshToken;
        // console.log("LOG: ~ verifyToken ~ refreshToken:", refreshToken);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                error: "Access Denied",
                data: null,
            });
            return;
        }

        const userId = await decodeToken(token);

        const user = await authService.authenticateUser(userId, true);

        if (!user || user?.id == undefined) {
            res.status(401).json({
                success: false,
                error: "Invalid Token",
                data: 1,
            });
            return;
        }

        req.verifiedUserId = user?.id;
        req.verifiedUser = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            res.status(401).json({
                success: false,
                error: "Authentication failed.",
                data: null,
            });
            return;
        }

        let userId: number;

        try {
            userId = await decodeToken(token, "REFRESH");
        } catch (error) {
            res.status(401).json({
                success: false,
                error: "Invalid or expired token.",
                data: null,
            });
            return;
        }

        const user = await authService.authenticateUser(userId, true);

        if (!user) {
            res.status(401).json({
                success: false,
                error: "Invalid Credentials",
                data: null,
            });
            return;
        }

        console.log({
            user,
            token,
        });

        if (
            !user.refreshToken ||
            user.refreshToken !== token ||
            user?.id == undefined
        ) {
            // await authService.logout(userId);
            res.status(401).json({
                success: false,
                error: "Invalid Token",
                data: 2,
            });
            return;
        }

        req.verifiedUserId = user.id;
        req.verifiedUser = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const socketAuth = async (
    socket: Socket,
    next: (err?: Error) => void,
) => {
    try {
        const token = socket.handshake.query.token as string;

        // if (!token) {
        //     return next(new Error("Unauthorized"));
        // }

        // const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new Error("Unauthorized: Missing token"));
        }

        const decodedUser = await decodeToken(token);
        console.log("LOG: ~ socketAuth ~ decodedUser:", decodedUser);
        if (!decodedUser) {
            return next(new Error("Authentication error"));
        }
        socket.verifiedUserId = decodedUser;
        next();
    } catch (error) {
        console.error("Socket auth error:", error);

        next(new Error("Authentication error"));
    }
};

export default verifyToken;
