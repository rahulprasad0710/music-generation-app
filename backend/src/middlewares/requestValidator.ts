// src/middleware/validate.ts
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

import { $ZodIssue } from "zod/v4/core";
import { ErrorType } from "../enums/error.enum";

export interface ZodErrorItem {
    expected: string;
    code: string;
    path: (string | number)[];
    message: string;
}

function formatZodError(error: $ZodIssue[]) {
    const errors: Record<string, string> = {};
    error.forEach((err: $ZodIssue) => {
        const rawField = err.path[err.path.length - 1];
        const field = rawField === undefined ? "field" : String(rawField);

        if (
            err.code === "invalid_type" &&
            err.message.includes("received undefined")
        ) {
            errors[field] = `${field} is required`;
        } else {
            // fallback for other kinds of zod errors
            errors[field] = err.message;
        }
    });

    return { errors };
}

export const requestValidator = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            console.log("LOG: ~ requestValidator ~ error:", error);

            if (
                error instanceof ZodError &&
                error?.issues &&
                Array.isArray(error.issues) &&
                error.issues.length > 0
            ) {
                const formattedErrors = formatZodError(error.issues).errors;

                res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: formattedErrors,
                    devMessage: "Validation Error",
                    type: ErrorType.VALIDATION_ERROR,
                });
                return;
            } else {
                res.status(400).json({
                    success: false,
                    message: "Validation Went Wrong",
                    errors: error,
                    devMessage: "Validation Error",
                    type: ErrorType.INTERNAL_SERVER_ERROR,
                });
                return;
            }
        }
    };
};
export default requestValidator;
