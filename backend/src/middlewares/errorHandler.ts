import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError";
// import { logger } from "../config/logger";

const errorHandler = (
    err: unknown | AppError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.log({
        errorHandler: err,
    });

    if (err instanceof AppError) {
        // logger.error("App error", {
        //     method: req.method,
        //     path: req.originalUrl,
        //     status: err.statusCode,
        //     message: err.message,
        //     stack: err.stack,
        //     devMessage: "App Error",
        //     info: err.stack,
        //     type: err.errorType,
        // });
        res.status(err.statusCode).json({
            success: false,
            data: null,
            message: err.message,
            type: err.errorType,
            devMessage: "App Error",
            info: err.stack,
        });
    } else {
        if (err instanceof Error) {
            // logger.error("Unhandled error", {
            //     method: req.method,
            //     path: req.originalUrl,
            //     status: 500,
            //     message: err.message,
            //     stack: err.stack,
            // });
        }
        res.status(500).json({
            success: false,
            data: null,
            message: "Something went wrong.",
            type: "Internal Server Error",
            devMessage: err instanceof Error ? err.message : String(err),
            info:
                err instanceof Error
                    ? {
                          name: err.name,
                          message: err.message,
                          stack: err.stack,
                      }
                    : undefined,
        });
    }
};

export default errorHandler;
